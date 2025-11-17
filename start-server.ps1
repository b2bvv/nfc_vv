# PowerShell script to start local server
Write-Host "Starting local server..." -ForegroundColor Green
Write-Host ""
Write-Host "Server will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Try Python 3
try {
    $pythonVersion = python --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Using Python..." -ForegroundColor Green
        python -m http.server 8000
        exit
    }
} catch {}

# Try Python 2
try {
    $python2Version = python2 --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Using Python 2..." -ForegroundColor Green
        python2 -m SimpleHTTPServer 8000
        exit
    }
} catch {}

# Try Node.js http-server
try {
    $httpServer = Get-Command http-server -ErrorAction SilentlyContinue
    if ($httpServer) {
        Write-Host "Using Node.js http-server..." -ForegroundColor Green
        http-server -p 8000
        exit
    }
} catch {}

Write-Host ""
Write-Host "ERROR: No server found!" -ForegroundColor Red
Write-Host ""
Write-Host "Please install one of the following:" -ForegroundColor Yellow
Write-Host "  1. Python (https://www.python.org/downloads/)" -ForegroundColor White
Write-Host "  2. Node.js with http-server (npm install -g http-server)" -ForegroundColor White
Write-Host ""
Write-Host "Or use Live Server extension in VS Code" -ForegroundColor White
Read-Host "Press Enter to exit"

