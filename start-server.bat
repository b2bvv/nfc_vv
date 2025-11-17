@echo off
echo Starting local server...
echo.
echo Server will be available at: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.

REM Try Python 3 first
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python...
    python -m http.server 8000
    goto :end
)

REM Try Python 2
python2 --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python 2...
    python2 -m SimpleHTTPServer 8000
    goto :end
)

REM Try Node.js (if http-server is installed globally)
where http-server >nul 2>&1
if %errorlevel% == 0 (
    echo Using Node.js http-server...
    http-server -p 8000
    goto :end
)

echo.
echo ERROR: No server found!
echo.
echo Please install one of the following:
echo   1. Python (https://www.python.org/downloads/)
echo   2. Node.js with http-server (npm install -g http-server)
echo.
echo Or use Live Server extension in VS Code
pause

:end

