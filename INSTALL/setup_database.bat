@echo off
setlocal enabledelayedexpansion

REM Prompt user for TakeAByte directory path
set /p TAKEABYTE_PATH=Enter the full path to TakeAByte directory (e.g., C:\Users\nicol\OneDrive\Bureau\TakeAByte): 

REM Check if the specified directory exists
if not exist "%TAKEABYTE_PATH%" (
    echo The specified directory does not exist. Please check the path and try again.
    pause
    exit /b 1
)

REM Set fixed paths relative to TakeAByte directory
set "TAKEABYTE_INSTALL_PATH=%TAKEABYTE_PATH%\INSTALL"

set "SQL_FILE=%TAKEABYTE_INSTALL_PATH%\web-market-table.sql"
set "MASTER_SQL_FILE=%TAKEABYTE_INSTALL_PATH%\master_log.sql"
set "INIT_SQL_FILE=%TAKEABYTE_INSTALL_PATH%\init.sql"

REM Echo the SQL files being used
echo Reading SQL file: %SQL_FILE%
echo Reading master log SQL file: %MASTER_SQL_FILE%
echo Reading init SQL file: %INIT_SQL_FILE%

REM Prompt user for MySQL bin directory
set /p MYSQL_PATH=Enter the full path to your MySQL bin directory (e.g., C:\wamp64\bin\mysql\mysql8.3.0\bin): 

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
"%MYSQL_PATH%\mysql" -u%MYSQL_USER% -p"%MYSQL_PASSWORD%" -e "CREATE DATABASE IF NOT EXISTS %MYSQL_DATABASE% DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci"

REM Execute the initial SQL file with Latin-1 encoding
echo Executing SQL file with Latin-1 encoding...
"%MYSQL_PATH%\mysql" -u%MYSQL_USER% -p"%MYSQL_PASSWORD%" --default-character-set=latin1 %MYSQL_DATABASE% < "%SQL_FILE%"

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
"%MYSQL_PATH%\mysql" -u%MYSQL_USER% -p"%MYSQL_PASSWORD%" --default-character-set=latin1 %MYSQL_DATABASE% < "%MASTER_SQL_FILE%"

set TOKENMOD=9NM6BNOKkU_19LPimOQkKEifZxcIXQyDhKftMOAZrckVcU_RzP-969q7DhIEedf4DStVpy9xSNKZ7QIal1uUCQ

echo The generated token is: %TOKENMOD%

REM Check if the command was successful
if %ERRORLEVEL% NEQ 0 (
    echo Error occurred during master log SQL file execution
    pause
    exit /b %ERRORLEVEL%
) else (
    echo Master log SQL file executed successfully
)

REM Set paths relative to servJS and api directories under TakeAByte
set "SERVJS_PATH=%TAKEABYTE_PATH%\servJS"
set "API_PATH=%TAKEABYTE_PATH%\api"

REM Check if the servJS and api directories exist
if not exist "%SERVJS_PATH%" (
    echo The specified TakeAByte\servJS folder does not exist. Please check the path and try again.
    pause
    exit /b 1
)
if not exist "%API_PATH%" (
    echo The specified TakeAByte\api folder does not exist. Please check the path and try again.
    pause
    exit /b 1
)

REM Delete existing .env file if it exists
del /q "%API_PATH%\.env" >nul

REM Create .env file with required environment variables for API
echo DB_HOST=localhost>> "%API_PATH%\.env"
echo DB_USER=%MYSQL_USER%>> "%API_PATH%\.env"
echo DB_PASSWORD=%MYSQL_PASSWORD%>> "%API_PATH%\.env"
echo DB_DATABASE=%MYSQL_DATABASE%>> "%API_PATH%\.env"
echo PORT=3001>> "%API_PATH%\.env"
echo TOKEN_EXPIRY_HOURS=24>> "%API_PATH%\.env"

REM Delete existing data.env file if it exists
del /q "%SERVJS_PATH%\backEnd\data.env" >nul

REM Create data.env file with required environment variables for servJS
echo # Yelp API Key>> "%SERVJS_PATH%\backEnd\data.env"
echo YELP_API_KEY=oKVpja6MbYoVopKZDk81RsC4QMerf_ZTuYE1VIcKD9P1Im91oDAZPOs8fiuE5WIEsbRkreeSxkac7UqHaEjzvXOlYGP5qBI-IgjJfuZGtao3xPkp3jROETpgSiFHZnYx>> "%SERVJS_PATH%\backEnd\data.env"
echo.>> "%SERVJS_PATH%\backEnd\data.env"
echo # Port number for the server>> "%SERVJS_PATH%\backEnd\data.env"
echo PORT=4000>> "%SERVJS_PATH%\backEnd\data.env"
echo.>> "%SERVJS_PATH%\backEnd\data.env"
echo # Web Site admin token>> "%SERVJS_PATH%\backEnd\data.env"
echo WEB_TOKEN=%TOKENMOD%>> "%SERVJS_PATH%\backEnd\data.env"
echo.>> "%SERVJS_PATH%\backEnd\data.env"
echo # Allan API TOKEN>> "%SERVJS_PATH%\backEnd\data.env"
echo ALLAN_TOKEN=05fe835b-ec44-47b3-8a7f-795c089119e2>> "%SERVJS_PATH%\backEnd\data.env"

REM Call the script to start npm in servJS in a separate console window
echo Calling script to start npm in servJS...
start cmd /k "%SERVJS_PATH%\start_servJS.bat"

REM Call the script to start npm in api in a separate console window
echo Calling script to start npm in api...
start cmd /k "%API_PATH%\start_api.bat"

REM product data file
set "PRODUCT_DATA_FILE=%TAKEABYTE_PATH%\INSTALL\products.json"

REM Check if the specified product data file exists
if not exist "%PRODUCT_DATA_FILE%" (
    echo The specified product data file does not exist.
    pause
    exit /b 1
)

REM Echo the generated token
echo The generated token is: %TOKENMOD%

REM Call PowerShell to make the HTTP POST request
echo Making HTTP POST request to add products...
powershell -ExecutionPolicy Bypass -Command ^
    "$token = '%TOKENMOD%';" ^
    "$uri = 'http://localhost:3001/v1/products';" ^
    "$body = Get-Content -Raw '%PRODUCT_DATA_FILE%';" ^
    "$headers = @{ 'Authorization' = 'Bearer ' + $token; 'Content-Type' = 'application/json' };" ^
    "Invoke-RestMethod -Uri $uri -Method Post -Body $body -Headers $headers"

REM Execute the init SQL file with Latin-1 encoding
echo Executing init SQL file with Latin-1 encoding...
"%MYSQL_PATH%\mysql" -u%MYSQL_USER% -p"%MYSQL_PASSWORD%" --default-character-set=latin1 %MYSQL_DATABASE% < "%INIT_SQL_FILE%"

start http://localhost:4000/home

pause
