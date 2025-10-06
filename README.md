# Esker Vendor Update Process

## Overview

This repository provides documentation and tools for managing vendor updates in the Esker system. It includes automated processes, best practices, and user guides for maintaining vendor information efficiently.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Process Workflow](#process-workflow)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- Automated vendor data validation
- Batch update processing
- Error handling and logging
- Integration with Esker API
- Comprehensive audit trail
- Email notifications for update status

## Prerequisites

- Python 3.8 or higher
- Access to Esker system with appropriate credentials
- Required Python packages (see `requirements.txt`)
- Network connectivity to Esker servers

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/JohnTan38/esker-vendor-update-process.git
   cd esker-vendor-update-process
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure your environment:
   ```bash
   cp config.example.json config.json
   # Edit config.json with your credentials and settings
   ```

## Usage

### Basic Vendor Update

```bash
python vendor_update.py --input vendors.csv
```

### Batch Processing

```bash
python vendor_update.py --batch --input-dir ./vendor-data/
```

### Validation Only

```bash
python vendor_update.py --validate --input vendors.csv
```

## Configuration

Create a `config.json` file with the following structure:

```json
{
  "esker": {
    "api_url": "https://your-esker-instance.com/api",
    "api_key": "YOUR_API_KEY",
    "timeout": 30
  },
  "logging": {
    "level": "INFO",
    "file": "logs/vendor_update.log"
  },
  "email": {
    "enabled": true,
    "smtp_server": "smtp.example.com",
    "from_address": "noreply@example.com",
    "recipients": ["admin@example.com"]
  }
}
```

## Process Workflow

1. **Data Preparation**: Prepare vendor data in CSV format with required fields
2. **Validation**: System validates data format and required fields
3. **Update Execution**: Updates are sent to Esker API
4. **Error Handling**: Any errors are logged and reported
5. **Notification**: Summary email sent upon completion

### Required CSV Fields

- `vendor_id`: Unique vendor identifier
- `vendor_name`: Vendor business name
- `contact_email`: Primary contact email
- `address`: Vendor address
- `tax_id`: Tax identification number
- `payment_terms`: Payment terms code

## Troubleshooting

### Common Issues

**Issue**: API authentication failure
- **Solution**: Verify API key in config.json and ensure it hasn't expired

**Issue**: CSV parsing errors
- **Solution**: Ensure CSV file uses UTF-8 encoding and has all required columns

**Issue**: Network timeout errors
- **Solution**: Increase timeout value in config.json or check network connectivity

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions or issues, please:
- Open an issue in the GitHub repository
- Contact the development team at support@example.com
- Refer to the [Esker Documentation](https://www.esker.com/documentation/)
