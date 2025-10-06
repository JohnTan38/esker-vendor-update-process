# Esker Vendor Update Process - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Preparing Vendor Data](#preparing-vendor-data)
3. [Running Updates](#running-updates)
4. [Understanding Results](#understanding-results)
5. [Advanced Features](#advanced-features)
6. [Best Practices](#best-practices)
7. [FAQ](#faq)

## Getting Started

### Initial Setup

1. **Install Python**: Ensure you have Python 3.8 or higher installed
   ```bash
   python --version
   ```

2. **Set up the project**:
   ```bash
   git clone https://github.com/JohnTan38/esker-vendor-update-process.git
   cd esker-vendor-update-process
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure credentials**:
   ```bash
   cp config.example.json config.json
   ```
   Edit `config.json` with your Esker API credentials

### System Requirements

- **Operating System**: Windows 10+, macOS 10.14+, or Linux
- **Python**: 3.8 or higher
- **Memory**: Minimum 4GB RAM recommended
- **Disk Space**: 100MB for application and logs
- **Network**: Stable internet connection to Esker servers

## Preparing Vendor Data

### CSV File Format

Your vendor data file must be in CSV format with the following required columns:

| Column Name | Description | Format | Example |
|------------|-------------|--------|---------|
| vendor_id | Unique vendor identifier | Alphanumeric | V001 |
| vendor_name | Legal business name | Text | ABC Corporation |
| contact_email | Primary email address | Valid email | contact@abc.com |
| address | Complete mailing address | Text | 123 Main St, City, ST 12345 |
| tax_id | Tax identification number | Numeric with dashes | 12-3456789 |
| payment_terms | Payment terms code | NET30, NET45, NET60, etc. | NET30 |

### Example CSV

```csv
vendor_id,vendor_name,contact_email,address,tax_id,payment_terms
V001,ABC Corporation,contact@abc-corp.com,"123 Main St, New York, NY 10001",12-3456789,NET30
V002,XYZ Industries,info@xyz-industries.com,"456 Oak Ave, Los Angeles, CA 90001",98-7654321,NET45
```

### Data Validation Rules

- **vendor_id**: Must be unique across all vendors
- **vendor_name**: Cannot be empty, max 255 characters
- **contact_email**: Must be a valid email format
- **address**: Cannot be empty
- **tax_id**: Must match format XX-XXXXXXX
- **payment_terms**: Must be one of: NET30, NET45, NET60, NET90, COD

### Common Data Preparation Issues

1. **Encoding**: Always save CSV files as UTF-8
2. **Line Breaks**: Use standard line breaks (LF or CRLF)
3. **Special Characters**: Enclose fields with commas in double quotes
4. **Empty Fields**: All required fields must have values

## Running Updates

### Basic Update

To update vendors from a CSV file:

```bash
python vendor_update.py --input vendors.csv
```

### Validation Only

To validate data without making updates:

```bash
python vendor_update.py --input vendors.csv --validate
```

This is recommended as a first step to check your data quality.

### Using Custom Configuration

```bash
python vendor_update.py --input vendors.csv --config custom-config.json
```

### Batch Processing

For processing multiple files in a directory:

```bash
python vendor_update.py --batch --input-dir ./vendor-data/
```

## Understanding Results

### Console Output

The script provides real-time feedback:

```
INFO - Processing file: vendors.csv
INFO - Validation complete: 100 valid, 2 errors
INFO - Successfully updated vendor V001
INFO - Successfully updated vendor V002
ERROR - Failed to update vendor V003: Connection timeout
INFO - Processing complete: 99 successful, 1 failed

=== Processing Summary ===
Total Records: 100
Valid Records: 98
Validation Errors: 2
Successful Updates: 99
Failed Updates: 1
```

### Log Files

Detailed logs are stored in `logs/vendor_update.log`:

```
2025-01-15 10:30:15 - INFO - Processing file: vendors.csv
2025-01-15 10:30:16 - ERROR - Validation error in row 5: Invalid email format
2025-01-15 10:30:20 - INFO - Successfully updated vendor V001
```

### Error Types

1. **Validation Errors**: Data format or content issues
   - Fix the data in your CSV file and rerun

2. **API Errors**: Communication issues with Esker
   - Check network connectivity
   - Verify API credentials
   - Check Esker system status

3. **System Errors**: Application or environment issues
   - Check Python installation
   - Verify all dependencies are installed
   - Review log files for details

## Advanced Features

### Retry Logic

The system automatically retries failed updates based on configuration:

```json
{
  "esker": {
    "retry_attempts": 3,
    "retry_delay": 5
  }
}
```

### Email Notifications

Configure email notifications for update summaries:

```json
{
  "email": {
    "enabled": true,
    "recipients": ["admin@example.com"]
  }
}
```

### Custom Logging

Adjust logging verbosity and output:

```json
{
  "logging": {
    "level": "DEBUG",  // Options: DEBUG, INFO, WARNING, ERROR
    "file": "logs/vendor_update.log"
  }
}
```

## Best Practices

### Before Running Updates

1. **Backup**: Always backup your vendor data before updates
2. **Validate First**: Run with `--validate` flag before actual updates
3. **Test Environment**: Test with a small dataset first
4. **Review Logs**: Check previous logs for patterns

### Data Management

1. **Version Control**: Keep versions of your CSV files
2. **Naming Convention**: Use date-stamped filenames (e.g., vendors_2025-01-15.csv)
3. **Archive**: Move processed files to an archive folder
4. **Documentation**: Document any manual changes or exceptions

### Security

1. **Credentials**: Never commit config.json to version control
2. **API Keys**: Rotate API keys regularly
3. **Access Control**: Limit who can run updates
4. **Audit Trail**: Review logs regularly

### Performance

1. **Batch Size**: Process in batches of 100-500 records
2. **Timing**: Run during off-peak hours
3. **Monitoring**: Monitor system resources during large updates

## FAQ

### Q: What happens if the update fails midway?

A: The script logs all successful updates. You can filter out successful vendors from your CSV and rerun with only failed records.

### Q: Can I update partial vendor information?

A: Currently, the script requires all fields. Partial updates can be added as a feature request.

### Q: How do I handle duplicate vendor IDs?

A: The system will update the vendor with that ID. Ensure your CSV has unique vendor_id values.

### Q: What if my CSV has extra columns?

A: Extra columns are ignored. Only the required columns are processed.

### Q: Can I schedule automated updates?

A: Yes, you can use cron (Linux/Mac) or Task Scheduler (Windows) to run the script automatically.

### Q: How do I rollback changes?

A: The Esker system may have its own rollback capabilities. Contact your Esker administrator.

## Support and Troubleshooting

### Getting Help

1. Check the [README.md](README.md) for quick reference
2. Review error messages in log files
3. Search existing issues on GitHub
4. Contact your Esker system administrator

### Common Issues

**Issue: "Configuration file not found"**
- Solution: Copy `config.example.json` to `config.json`

**Issue: "Invalid API key"**
- Solution: Verify credentials in config.json
- Contact Esker admin to verify key is active

**Issue: "CSV parsing error"**
- Solution: Ensure file is UTF-8 encoded
- Verify all required columns are present
- Check for special characters

**Issue: "Connection timeout"**
- Solution: Increase timeout in config.json
- Check network connectivity
- Verify Esker server is accessible

### Reporting Issues

When reporting issues, include:
1. Python version (`python --version`)
2. Operating system
3. Error message from console
4. Relevant log file entries
5. Sample data (without sensitive information)

## Appendix

### Payment Terms Reference

- **NET30**: Payment due within 30 days
- **NET45**: Payment due within 45 days
- **NET60**: Payment due within 60 days
- **NET90**: Payment due within 90 days
- **COD**: Cash on delivery

### API Endpoint Reference

The script uses the following Esker API endpoints:

- `PUT /api/vendors/{vendor_id}`: Update vendor information
- `GET /api/vendors/{vendor_id}`: Retrieve vendor information
- `POST /api/vendors`: Create new vendor

### Exit Codes

- `0`: Success - all records processed without errors
- `1`: Errors occurred - check logs for details

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Development Team
