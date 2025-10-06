@echo off
REM Esker Vendor Update Process - Setup Script for Windows
REM This script helps set up the development environment

echo === Esker Vendor Update Process - Setup ===
echo.

REM Check Python version
echo Checking Python version...
python --version
if %ERRORLEVEL% NEQ 0 (
    echo Error: Python is not installed or not in PATH
    exit /b 1
)

echo.

REM Create virtual environment
echo Creating virtual environment...
if exist venv (
    echo Virtual environment already exists
) else (
    python -m venv venv
    echo Virtual environment created
)

echo.

REM Install dependencies
set /p install="Install dependencies now? (y/n): "
if /i "%install%"=="y" (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
    
    echo Installing dependencies...
    python -m pip install --upgrade pip
    pip install -r requirements.txt
    
    echo Dependencies installed
)

echo.

REM Setup configuration
if not exist config.json (
    echo Configuration file not found.
    set /p create="Create config.json from example? (y/n): "
    if /i "%create%"=="y" (
        copy config.example.json config.json
        echo Created config.json
        echo WARNING: Please edit config.json with your Esker credentials
    )
) else (
    echo config.json already exists
)

echo.

REM Create directories
echo Creating necessary directories...
if not exist logs mkdir logs
if not exist output mkdir output
echo Directories created

echo.
echo === Setup Complete ===
echo.
echo Next steps:
echo 1. Activate virtual environment: venv\Scripts\activate.bat
echo 2. Edit config.json with your Esker credentials
echo 3. Run validation test: python vendor_update.py --validate --input vendors.example.csv
echo 4. Review USER_GUIDE.md for detailed instructions
echo.

pause
