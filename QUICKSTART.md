# Quick Reference Guide

## Installation

```bash
git clone https://github.com/JohnTan38/esker-vendor-update-process.git
cd esker-vendor-update-process
./setup.sh  # or setup.bat on Windows
```

## Configuration

```bash
cp config.example.json config.json
# Edit config.json with your Esker credentials
```

## Common Commands

### Validate Data Only
```bash
python vendor_update.py --validate --input vendors.csv
```

### Update Vendors
```bash
python vendor_update.py --input vendors.csv
```

### Use Custom Config
```bash
python vendor_update.py --input vendors.csv --config custom-config.json
```

### Batch Processing
```bash
python vendor_update.py --batch --input-dir ./vendor-data/
```

## CSV Format

Required columns:
- vendor_id
- vendor_name
- contact_email
- address
- tax_id
- payment_terms

Example:
```csv
vendor_id,vendor_name,contact_email,address,tax_id,payment_terms
V001,ABC Corp,contact@abc.com,"123 Main St, NY 10001",12-3456789,NET30
```

## Troubleshooting

### Configuration Error
```
Error: Configuration file config.json not found.
```
**Solution**: `cp config.example.json config.json`

### Invalid Email
```
Validation error in row 5: Invalid email format
```
**Solution**: Fix email in CSV file, ensure valid format

### API Authentication
```
Failed to update vendor: 401 Unauthorized
```
**Solution**: Check API key in config.json

### Connection Timeout
```
Failed to update vendor: Connection timeout
```
**Solution**: Increase timeout in config.json or check network

## Log Files

- Location: `logs/vendor_update.log`
- Format: `YYYY-MM-DD HH:MM:SS - LEVEL - Message`
- Levels: DEBUG, INFO, WARNING, ERROR

## Exit Codes

- `0`: Success - all records processed
- `1`: Errors occurred - check logs

## File Structure

```
esker-vendor-update-process/
├── vendor_update.py          # Main script
├── config.json               # Your configuration (not in git)
├── config.example.json       # Configuration template
├── vendors.example.csv       # Example input file
├── requirements.txt          # Python dependencies
├── README.md                 # Full documentation
├── USER_GUIDE.md            # Detailed user guide
├── ARCHITECTURE.md          # Technical architecture
├── logs/                    # Log files directory
├── output/                  # Output files directory
└── tests/                   # Test files
```

## Support

- Documentation: [README.md](README.md)
- User Guide: [USER_GUIDE.md](USER_GUIDE.md)
- Architecture: [ARCHITECTURE.md](ARCHITECTURE.md)
- Issues: https://github.com/JohnTan38/esker-vendor-update-process/issues

## Quick Tips

✓ Always validate before updating  
✓ Keep backups of your vendor data  
✓ Review logs after each run  
✓ Use test environment first  
✓ Process in small batches initially  
✗ Don't commit config.json  
✗ Don't share API keys  
✗ Don't skip validation  

---

For detailed documentation, see [USER_GUIDE.md](USER_GUIDE.md)
