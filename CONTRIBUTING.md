# Contributing to Esker Vendor Update Process

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help maintain a welcoming environment

## How to Contribute

### Reporting Bugs

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps to reproduce the problem
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment**: 
   - Python version
   - Operating system
   - Relevant configuration
6. **Logs**: Relevant log entries or error messages

### Suggesting Enhancements

For feature requests:

1. Use the GitHub issue tracker
2. Clearly describe the feature and its benefits
3. Provide examples of how it would be used
4. Consider backwards compatibility

### Pull Requests

1. **Fork the Repository**
   ```bash
   git clone https://github.com/YourUsername/esker-vendor-update-process.git
   cd esker-vendor-update-process
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   python -m pytest tests/
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add feature: your feature description"
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Submit a Pull Request**
   - Provide a clear description
   - Reference any related issues
   - Ensure all checks pass

## Development Setup

### Prerequisites

- Python 3.8+
- Git
- Virtual environment tool

### Setup Steps

```bash
# Clone repository
git clone https://github.com/JohnTan38/esker-vendor-update-process.git
cd esker-vendor-update-process

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install development dependencies
pip install -r requirements-dev.txt
```

## Code Style

### Python Style Guide

- Follow PEP 8
- Use type hints where appropriate
- Maximum line length: 100 characters
- Use docstrings for all functions and classes

### Example

```python
def process_vendor(vendor_id: str, data: Dict) -> bool:
    """
    Process a single vendor update.
    
    Args:
        vendor_id: Unique identifier for the vendor
        data: Dictionary containing vendor information
        
    Returns:
        True if successful, False otherwise
    """
    pass
```

## Testing

### Running Tests

```bash
# Run all tests
python -m pytest tests/

# Run with coverage
python -m pytest tests/ --cov=. --cov-report=html
```

### Writing Tests

- Place tests in the `tests/` directory
- Use descriptive test names
- Test both success and failure cases
- Mock external API calls

## Documentation

### Documentation Standards

- Update README.md for user-facing changes
- Update USER_GUIDE.md for process changes
- Add docstrings to new functions
- Include code examples where helpful

## Review Process

### What to Expect

1. **Initial Review**: Maintainer reviews within 1 week
2. **Feedback**: You may receive requests for changes
3. **Iteration**: Make requested changes and push updates
4. **Approval**: Once approved, changes will be merged

### Review Criteria

- Code quality and style
- Test coverage
- Documentation completeness
- Backwards compatibility
- Performance implications

## Release Process

1. Update version numbers
2. Update CHANGELOG.md
3. Create release tag
4. Publish release notes

## Questions?

If you have questions:

- Open an issue for discussion
- Tag it with "question" label
- Be patient while waiting for response

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
