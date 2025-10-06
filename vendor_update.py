#!/usr/bin/env python3
"""
Esker Vendor Update Process

This script handles the automated updating of vendor information in the Esker system.
It supports batch processing, validation, and error handling.
"""

import argparse
import json
import logging
import sys
from pathlib import Path
from typing import Dict, List, Optional

import pandas as pd
import requests
from pydantic import BaseModel, EmailStr, ValidationError


class VendorData(BaseModel):
    """Model for vendor data validation."""
    vendor_id: str
    vendor_name: str
    contact_email: EmailStr
    address: str
    tax_id: str
    payment_terms: str


class VendorUpdateProcessor:
    """Handles vendor update operations."""
    
    def __init__(self, config_path: str = "config.json"):
        """Initialize the processor with configuration."""
        self.config = self._load_config(config_path)
        self._setup_logging()
        self.logger = logging.getLogger(__name__)
        
    def _load_config(self, config_path: str) -> Dict:
        """Load configuration from JSON file."""
        try:
            with open(config_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Error: Configuration file {config_path} not found.")
            print("Please copy config.example.json to config.json and update with your settings.")
            sys.exit(1)
        except json.JSONDecodeError as e:
            print(f"Error: Invalid JSON in configuration file: {e}")
            sys.exit(1)
            
    def _setup_logging(self):
        """Configure logging based on config settings."""
        log_config = self.config.get('logging', {})
        log_level = getattr(logging, log_config.get('level', 'INFO'))
        log_format = log_config.get('format', '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        
        # Create logs directory if it doesn't exist
        log_file = log_config.get('file', 'logs/vendor_update.log')
        Path(log_file).parent.mkdir(parents=True, exist_ok=True)
        
        logging.basicConfig(
            level=log_level,
            format=log_format,
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler(sys.stdout)
            ]
        )
        
    def validate_vendor_data(self, df: pd.DataFrame) -> tuple[List[VendorData], List[Dict]]:
        """
        Validate vendor data from DataFrame.
        
        Returns:
            Tuple of (valid_vendors, errors)
        """
        valid_vendors = []
        errors = []
        
        for idx, row in df.iterrows():
            try:
                vendor = VendorData(**row.to_dict())
                valid_vendors.append(vendor)
            except ValidationError as e:
                errors.append({
                    'row': idx + 2,  # +2 for header and 0-indexing
                    'errors': e.errors()
                })
                self.logger.error(f"Validation error in row {idx + 2}: {e}")
                
        return valid_vendors, errors
        
    def update_vendor(self, vendor: VendorData) -> bool:
        """
        Update a single vendor in Esker system.
        
        Returns:
            True if successful, False otherwise
        """
        esker_config = self.config['esker']
        api_url = esker_config['api_url']
        api_key = esker_config['api_key']
        timeout = esker_config.get('timeout', 30)
        
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        endpoint = f"{api_url}/vendors/{vendor.vendor_id}"
        payload = vendor.model_dump()
        
        try:
            response = requests.put(
                endpoint,
                json=payload,
                headers=headers,
                timeout=timeout
            )
            response.raise_for_status()
            self.logger.info(f"Successfully updated vendor {vendor.vendor_id}")
            return True
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Failed to update vendor {vendor.vendor_id}: {e}")
            return False
            
    def process_file(self, input_file: str, validate_only: bool = False) -> Dict:
        """
        Process a vendor CSV file.
        
        Returns:
            Dictionary with processing statistics
        """
        self.logger.info(f"Processing file: {input_file}")
        
        try:
            df = pd.read_csv(input_file)
        except Exception as e:
            self.logger.error(f"Error reading CSV file: {e}")
            return {'error': str(e)}
            
        valid_vendors, validation_errors = self.validate_vendor_data(df)
        
        stats = {
            'total_records': len(df),
            'valid_records': len(valid_vendors),
            'validation_errors': len(validation_errors),
            'successful_updates': 0,
            'failed_updates': 0
        }
        
        if validate_only:
            self.logger.info(f"Validation complete: {stats['valid_records']} valid, "
                           f"{stats['validation_errors']} errors")
            return stats
            
        # Process updates
        for vendor in valid_vendors:
            if self.update_vendor(vendor):
                stats['successful_updates'] += 1
            else:
                stats['failed_updates'] += 1
                
        self.logger.info(f"Processing complete: {stats['successful_updates']} successful, "
                        f"{stats['failed_updates']} failed")
        
        return stats


def main():
    """Main entry point for the script."""
    parser = argparse.ArgumentParser(
        description='Esker Vendor Update Process',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument(
        '--input',
        required=True,
        help='Input CSV file containing vendor data'
    )
    parser.add_argument(
        '--config',
        default='config.json',
        help='Configuration file path (default: config.json)'
    )
    parser.add_argument(
        '--validate',
        action='store_true',
        help='Only validate data without updating'
    )
    parser.add_argument(
        '--batch',
        action='store_true',
        help='Enable batch processing mode'
    )
    
    args = parser.parse_args()
    
    processor = VendorUpdateProcessor(config_path=args.config)
    stats = processor.process_file(args.input, validate_only=args.validate)
    
    print("\n=== Processing Summary ===")
    for key, value in stats.items():
        print(f"{key.replace('_', ' ').title()}: {value}")
    
    # Exit with error code if there were failures
    if stats.get('failed_updates', 0) > 0 or stats.get('validation_errors', 0) > 0:
        sys.exit(1)
    

if __name__ == '__main__':
    main()
