@echo off
echo Stopping any existing frontend processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Starting frontend with updated environment...
npm run dev