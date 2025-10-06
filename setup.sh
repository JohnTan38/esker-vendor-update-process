#!/bin/bash

# Esker Vendor Update Process - Setup Script
# This script helps set up the development environment

set -e

echo "=== Esker Vendor Update Process - Setup ==="
echo ""

# Check Python version
echo "Checking Python version..."
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "Found Python $python_version"

required_version="3.8"
if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" = "$required_version" ]; then 
    echo "✓ Python version is compatible"
else
    echo "✗ Python 3.8 or higher is required"
    exit 1
fi

echo ""

# Create virtual environment
echo "Creating virtual environment..."
if [ -d "venv" ]; then
    echo "Virtual environment already exists"
else
    python3 -m venv venv
    echo "✓ Virtual environment created"
fi

echo ""

# Activate virtual environment
echo "To activate the virtual environment, run:"
echo "  source venv/bin/activate  (on Linux/Mac)"
echo "  venv\\Scripts\\activate     (on Windows)"

echo ""

# Install dependencies
read -p "Install dependencies now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
    
    echo "Installing dependencies..."
    pip install --upgrade pip
    pip install -r requirements.txt
    
    echo "✓ Dependencies installed"
fi

echo ""

# Setup configuration
if [ ! -f "config.json" ]; then
    echo "Configuration file not found."
    read -p "Create config.json from example? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp config.example.json config.json
        echo "✓ Created config.json"
        echo "⚠ Please edit config.json with your Esker credentials"
    fi
else
    echo "config.json already exists"
fi

echo ""

# Create directories
echo "Creating necessary directories..."
mkdir -p logs output
echo "✓ Directories created"

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "1. Activate virtual environment: source venv/bin/activate"
echo "2. Edit config.json with your Esker credentials"
echo "3. Run validation test: python vendor_update.py --validate --input vendors.example.csv"
echo "4. Review USER_GUIDE.md for detailed instructions"
echo ""
