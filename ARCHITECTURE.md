# Architecture Documentation

## System Overview

The Esker Vendor Update Process is a Python-based automation tool designed to streamline the process of updating vendor information in the Esker system. The system provides data validation, error handling, and comprehensive logging.

## Architecture Diagram

```
┌─────────────────┐
│   CSV Input     │
│  (vendors.csv)  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   VendorUpdateProcessor             │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  1. Load Configuration       │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  2. Parse CSV Data           │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  3. Validate Data            │  │
│  │     - Email format           │  │
│  │     - Required fields        │  │
│  │     - Data types             │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  4. Process Updates          │  │
│  │     - Retry logic            │  │
│  │     - Error handling         │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  5. Generate Reports         │  │
│  └──────────────────────────────┘  │
└───────────────┬─────────────────────┘
                │
      ┌─────────┴──────────┐
      │                    │
      ▼                    ▼
┌───────────┐      ┌─────────────┐
│   Esker   │      │  Log Files  │
│    API    │      │   Reports   │
└───────────┘      └─────────────┘
```

## Components

### 1. VendorData Model (Pydantic)

**Purpose**: Data validation and type checking

**Fields**:
- `vendor_id`: Unique identifier
- `vendor_name`: Business name
- `contact_email`: Validated email address
- `address`: Physical address
- `tax_id`: Tax identification
- `payment_terms`: Payment terms code

**Validation Rules**:
- Email format validation using EmailStr
- All fields required (no null values)
- Type checking for all fields

### 2. VendorUpdateProcessor

**Purpose**: Main processing engine

**Key Methods**:

#### `__init__(config_path)`
- Loads configuration from JSON file
- Sets up logging infrastructure
- Initializes API client

#### `validate_vendor_data(df)`
- Validates DataFrame records
- Returns tuple of (valid_vendors, errors)
- Logs validation failures

#### `update_vendor(vendor)`
- Sends PUT request to Esker API
- Handles retry logic
- Returns success/failure status

#### `process_file(input_file, validate_only)`
- Orchestrates the entire update process
- Returns processing statistics

## Data Flow

1. **Input**: User provides CSV file with vendor data
2. **Parsing**: Pandas reads CSV into DataFrame
3. **Validation**: Each record validated against VendorData model
4. **Processing**: Valid records sent to Esker API
5. **Logging**: All operations logged to file and console
6. **Output**: Summary statistics and error reports

## Error Handling

### Validation Errors
- Caught at validation stage
- Logged with row numbers
- Original records not sent to API
- User receives detailed error report

### API Errors
- Network timeouts: Retry with exponential backoff
- Authentication failures: Log and exit
- Rate limiting: Respect retry-after headers
- Server errors: Log and continue to next record

### System Errors
- Configuration missing: Exit with helpful message
- CSV parsing errors: Detailed error with line numbers
- Disk space issues: Fail gracefully

## Configuration

### Structure
```json
{
  "esker": {
    "api_url": "API endpoint",
    "api_key": "Authentication key",
    "timeout": "Request timeout in seconds",
    "retry_attempts": "Number of retries",
    "retry_delay": "Delay between retries"
  },
  "logging": {
    "level": "Log level (DEBUG, INFO, WARNING, ERROR)",
    "file": "Log file path",
    "format": "Log message format"
  },
  "email": {
    "enabled": "Enable/disable notifications",
    "smtp_server": "SMTP server address",
    "recipients": "List of email recipients"
  }
}
```

### Security Considerations
- Configuration file excluded from version control
- API keys stored securely
- No credentials in code or logs
- HTTPS only for API communication

## Logging Strategy

### Log Levels
- **DEBUG**: Detailed diagnostic information
- **INFO**: General informational messages
- **WARNING**: Warning messages for potential issues
- **ERROR**: Error messages for failures

### Log Format
```
2025-01-15 10:30:15 - vendor_update - INFO - Successfully updated vendor V001
```

### Log Rotation
- Maximum file size: 10MB
- Backup count: 5 files
- Automatic rotation when limit reached

## API Integration

### Esker API Endpoints

#### Update Vendor
- **Method**: PUT
- **Endpoint**: `/api/vendors/{vendor_id}`
- **Headers**: 
  - Authorization: Bearer {api_key}
  - Content-Type: application/json
- **Body**: JSON representation of vendor data

### Request/Response Flow

```
Client Request:
PUT /api/vendors/V001
Headers:
  Authorization: Bearer xxx
  Content-Type: application/json
Body:
{
  "vendor_id": "V001",
  "vendor_name": "ABC Corp",
  ...
}

Successful Response:
Status: 200 OK
Body:
{
  "status": "success",
  "vendor_id": "V001",
  "updated_at": "2025-01-15T10:30:15Z"
}

Error Response:
Status: 400 Bad Request
Body:
{
  "status": "error",
  "message": "Invalid vendor data",
  "errors": [...]
}
```

## Performance Considerations

### Optimization Strategies

1. **Batch Processing**
   - Process records in configurable batches
   - Default: 100 records per batch
   - Reduces memory footprint

2. **Parallel Processing**
   - Future enhancement: Thread pool for parallel updates
   - Respect API rate limits

3. **Caching**
   - Cache configuration data
   - Reuse HTTP connections

4. **Memory Management**
   - Stream large CSV files
   - Clear processed records from memory

### Scalability

- **Current**: Handles up to 10,000 records efficiently
- **Limit**: Memory-bound by CSV file size
- **Future**: Database backend for very large datasets

## Testing Strategy

### Unit Tests
- Test individual functions
- Mock external dependencies
- Validate data models

### Integration Tests
- Test end-to-end workflows
- Use test Esker environment
- Verify API integration

### Test Coverage
- Target: 80% code coverage
- Critical paths: 100% coverage
- Edge cases included

## Deployment

### Requirements
- Python 3.8+
- Network access to Esker API
- File system permissions for logs/output

### Installation Steps
1. Clone repository
2. Run setup script
3. Configure credentials
4. Test with validation mode

### Monitoring
- Review log files regularly
- Set up email alerts
- Monitor API usage/quotas

## Future Enhancements

1. **Database Support**
   - Store vendor data in database
   - Track update history
   - Enable rollback functionality

2. **Web Interface**
   - Upload CSV via web form
   - Real-time progress tracking
   - Interactive error resolution

3. **Advanced Features**
   - Scheduled automated updates
   - Incremental updates
   - Conflict resolution
   - Multi-language support

4. **Integration**
   - Connect to other ERP systems
   - Export to multiple formats
   - REST API for other services

## Maintenance

### Regular Tasks
- Review and rotate logs
- Update dependencies
- Monitor API changes
- Back up configuration

### Troubleshooting
- Check logs first
- Verify configuration
- Test API connectivity
- Review CSV format

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Author**: Development Team
