@echo off
cd "%~dp0"
echo Installing npm packages...
npm install

echo Starting npm in api...
npm start

pause
