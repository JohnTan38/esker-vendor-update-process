"""
Unit tests for vendor update processor.
"""

import pytest
import pandas as pd
from pathlib import Path
import json
import tempfile
from vendor_update import VendorUpdateProcessor, VendorData


@pytest.fixture
def sample_config():
    """Fixture providing sample configuration."""
    return {
        "esker": {
            "api_url": "https://test.esker.com/api",
            "api_key": "test_key",
            "timeout": 30,
            "retry_attempts": 3,
            "retry_delay": 5
        },
        "logging": {
            "level": "INFO",
            "file": "logs/test.log",
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        },
        "email": {
            "enabled": false
        }
    }


@pytest.fixture
def temp_config_file(sample_config):
    """Create a temporary config file."""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
        json.dump(sample_config, f)
        config_path = f.name
    yield config_path
    Path(config_path).unlink()


@pytest.fixture
def sample_vendor_data():
    """Fixture providing sample vendor data."""
    return pd.DataFrame([
        {
            'vendor_id': 'V001',
            'vendor_name': 'Test Vendor',
            'contact_email': 'test@example.com',
            'address': '123 Test St',
            'tax_id': '12-3456789',
            'payment_terms': 'NET30'
        }
    ])


class TestVendorData:
    """Tests for VendorData model."""
    
    def test_valid_vendor_data(self):
        """Test valid vendor data validation."""
        vendor = VendorData(
            vendor_id='V001',
            vendor_name='Test Vendor',
            contact_email='test@example.com',
            address='123 Test St',
            tax_id='12-3456789',
            payment_terms='NET30'
        )
        assert vendor.vendor_id == 'V001'
        assert vendor.vendor_name == 'Test Vendor'
    
    def test_invalid_email(self):
        """Test validation fails for invalid email."""
        with pytest.raises(Exception):
            VendorData(
                vendor_id='V001',
                vendor_name='Test Vendor',
                contact_email='invalid-email',
                address='123 Test St',
                tax_id='12-3456789',
                payment_terms='NET30'
            )


class TestVendorUpdateProcessor:
    """Tests for VendorUpdateProcessor class."""
    
    def test_processor_initialization(self, temp_config_file):
        """Test processor initializes with config."""
        processor = VendorUpdateProcessor(config_path=temp_config_file)
        assert processor.config is not None
        assert 'esker' in processor.config
    
    def test_validate_vendor_data(self, temp_config_file, sample_vendor_data):
        """Test vendor data validation."""
        processor = VendorUpdateProcessor(config_path=temp_config_file)
        valid_vendors, errors = processor.validate_vendor_data(sample_vendor_data)
        
        assert len(valid_vendors) == 1
        assert len(errors) == 0
        assert valid_vendors[0].vendor_id == 'V001'
    
    def test_validate_invalid_data(self, temp_config_file):
        """Test validation catches invalid data."""
        processor = VendorUpdateProcessor(config_path=temp_config_file)
        
        invalid_data = pd.DataFrame([
            {
                'vendor_id': 'V001',
                'vendor_name': 'Test Vendor',
                'contact_email': 'invalid-email',  # Invalid email
                'address': '123 Test St',
                'tax_id': '12-3456789',
                'payment_terms': 'NET30'
            }
        ])
        
        valid_vendors, errors = processor.validate_vendor_data(invalid_data)
        
        assert len(valid_vendors) == 0
        assert len(errors) == 1


def test_csv_example_file():
    """Test that example CSV file is valid."""
    example_file = Path('vendors.example.csv')
    if example_file.exists():
        df = pd.read_csv(example_file)
        assert 'vendor_id' in df.columns
        assert 'vendor_name' in df.columns
        assert 'contact_email' in df.columns
        assert len(df) > 0


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
