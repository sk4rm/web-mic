@echo off
setlocal enabledelayedexpansion

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in the system PATH.
    echo Please install Node.js and try again.
    exit /b 1
)

:: Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: npm is not installed or not in the system PATH.
    echo Please install npm and try again.
    exit /b 1
)

:: Run npm install
echo Installing dependencies...
call npm install --silent
if %errorlevel% neq 0 (
    echo Error: npm install failed.
    exit /b 1
)

:: Check if npx is available
where npx >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: npx is not available. It should be included with npm 5.2+.
    echo Please update npm or install npx separately.
    exit /b 1
)

:: Open server web UI
echo Opening server web UI in browser...
start "" server\index.html
if %errorlevel% neq 0 (
    echo Error: Failed to open webpage.
    exit /b 1
)

:: Run PeerServer
echo Starting PeerServer...
echo Press Ctrl-C at any time to stop.
call npx peerjs --key web-mic --port 443
if %errorlevel% neq 0 (
    echo Error: npx peerjs command failed.
    exit /b 1
)