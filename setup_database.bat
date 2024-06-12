@echo off
setlocal enabledelayedexpansion

REM Prompt user for MySQL bin directory
set /p MYSQL_PATH=Enter the full path to your MySQL bin directory (e.g., C:\wamp64\bin\mysql\mysql5.7.24\bin): 

REM Check if the specified MySQL bin directory exists
if not exist "%MYSQL_PATH%\mysql.exe" (
    echo MySQL executable not found in the specified directory. Please check the path and try again.
    pause
    exit /b 1
)

echo MySQL found at %MYSQL_PATH%

REM Prompt user for MySQL credentials and database details
set /p MYSQL_USER=Enter MySQL username: 
set /p MYSQL_PASSWORD=Enter MySQL password: 
set /p MYSQL_DATABASE=Enter database name: 
set /p SQL_FILE=Enter the full path to your SQL file: 
set /p MASTER_SQL_FILE=Enter the full path to your master log SQL file: 
set /p TAKEABYTE_PATH=Enter the full path to your TakeAByte folder: 

REM Check if SQL files exist
if not exist "%SQL_FILE%" (
    echo The specified SQL file does not exist.
    pause
    exit /b 1
)
if not exist "%MASTER_SQL_FILE%" (
    echo The specified master log SQL file does not exist.
    pause
    exit /b 1
)

REM Create database if it does not exist with Latin-1 encoding
echo Creating database if it does not exist with Latin-1 encoding...
"%MYSQL_PATH%\mysql" -u%MYSQL_USER% -p%MYSQL_PASSWORD% -e "CREATE DATABASE IF NOT EXISTS %MYSQL_DATABASE% DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci"

REM Execute the initial SQL file with Latin-1 encoding
echo Executing SQL file with Latin-1 encoding...
"%MYSQL_PATH%\mysql" -u%MYSQL_USER% -p%MYSQL_PASSWORD% --default-character-set=latin1 %MYSQL_DATABASE% < "%SQL_FILE%"

REM Check if the command was successful
if %ERRORLEVEL% NEQ 0 (
    echo Error occurred during initial SQL file execution
    pause
    exit /b %ERRORLEVEL%
) else (
    echo Initial SQL file executed successfully
)

REM Execute the master log SQL file with Latin-1 encoding
echo Executing master log SQL file with Latin-1 encoding...
"%MYSQL_PATH%\mysql" -u%MYSQL_USER% -p%MYSQL_PASSWORD% --default-character-set=latin1 %MYSQL_DATABASE% < "%MASTER_SQL_FILE%"

REM Check if the command was successful
if %ERRORLEVEL% NEQ 0 (
    echo Error occurred during master log SQL file execution
    pause
    exit /b %ERRORLEVEL%
) else (
    echo Master log SQL file executed successfully
)

REM Check if the TakeAByte path exists
if not exist "%TAKEABYTE_PATH%\servJS" (
    echo The specified TakeAByte\servJS folder does not exist. Please check the path and try again.
    pause
    exit /b 1
)
if not exist "%TAKEABYTE_PATH%\api" (
    echo The specified TakeAByte\api folder does not exist. Please check the path and try again.
    pause
    exit /b 1
)

REM Call the script to start npm in servJS in a separate console window
echo Calling script to start npm in servJS...
start cmd /k "%TAKEABYTE_PATH%\servJS\start_servJS.bat"

REM Call the script to start npm in api in a separate console window
echo Calling script to start npm in api...
start cmd /k "%TAKEABYTE_PATH%\api\start_api.bat"

REM Prompt user for the product data file
set /p PRODUCT_DATA_FILE=Enter the full path to the product data JSON file: 

REM Check if the specified product data file exists
if not exist "%PRODUCT_DATA_FILE%" (
    echo The specified product data file does not exist.
    pause
    exit /b 1
)

REM Call PowerShell to make the HTTP POST request
powershell -ExecutionPolicy Bypass -Command "& { 
    $token = 'YourTokenHere'
    $uri = 'http://localhost:3001/v1/products'
    $body = Get-Content -Raw '%PRODUCT_DATA_FILE%'
    $headers = @{
        'Authorization' = 'Bearer ' + $token
        'Content-Type' = 'application/json'
    }
    Invoke-RestMethod -Uri $uri -Method Post -Body $body -Headers $headers
}"

pause