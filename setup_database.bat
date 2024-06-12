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
set /p SQL_FILE=Enter the full path to your tables SQL file: 
set /p MASTER_SQL_FILE=Enter the full path to your master log SQL file:
set /p INIT_SQL_FILE=Enter the full path to your init SQL file:
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

REM Delete existing .env file if it exists
del /q "%TAKEABYTE_PATH%\api\.env" >nul

REM Create .env file with required environment variables
echo DB_HOST=localhost>> "%TAKEABYTE_PATH%\api\.env"
echo DB_USER=%MYSQL_USER%>> "%TAKEABYTE_PATH%\api\.env"
echo DB_PASSWORD=%MYSQL_PASSWORD%>> "%TAKEABYTE_PATH%\api\.env"
echo DB_DATABASE=%MYSQL_DATABASE%>> "%TAKEABYTE_PATH%\api\.env"
echo PORT=3001>> "%TAKEABYTE_PATH%\api\.env"
echo TOKEN_EXPIRY_HOURS=24>> "%TAKEABYTE_PATH%\api\.env"


REM Delete existing data.env file if it exists
del /q "%TAKEABYTE_PATH%\servJS\backEnd\data.env" >nul

REM Create data.env file with required environment variables
echo # Yelp API Key>> "%TAKEABYTE_PATH%\servJS\backEnd\data.env"
echo YELP_API_KEY=oKVpja6MbYoVopKZDk81RsC4QMerf_ZTuYE1VIcKD9P1Im91oDAZPOs8fiuE5WIEsbRkreeSxkac7UqHaEjzvXOlYGP5qBI-IgjJfuZGtao3xPkp3jROETpgSiFHZnYx>> "%TAKEABYTE_PATH%\servJS\backEnd\data.env"
echo.>> "%TAKEABYTE_PATH%\servJS\backEnd\data.env"
echo # Port number for the server>> "%TAKEABYTE_PATH%\servJS\backEnd\data.env"
echo PORT=4000>> "%TAKEABYTE_PATH%\servJS\backEnd\data.env"
echo.>> "%TAKEABYTE_PATH%\servJS\backEnd\data.env"
echo # Web Site admin token>> "%TAKEABYTE_PATH%\servJS\backEnd\data.env"
echo WEB_TOKEN=%TOKENMOD%>> "%TAKEABYTE_PATH%\servJS\backEnd\data.env"
echo.>> "%TAKEABYTE_PATH%\servJS\backEnd\data.env"
echo # Allan API TOKEN>> "%TAKEABYTE_PATH%\servJS\backEnd\data.env"
echo ALLAN_TOKEN=05fe835b-ec44-47b3-8a7f-795c089119e2>> "%TAKEABYTE_PATH%\servJS\backEnd\data.env"



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

REM Echo the generated token
echo The generated token is: %TOKENMOD%

REM Call PowerShell to make the HTTP POST request
powershell -ExecutionPolicy Bypass -Command ^
    "$token = '%TOKENMOD%';" ^
    "$uri = 'http://localhost:3001/v1/products';" ^
    "$body = Get-Content -Raw '%PRODUCT_DATA_FILE%';" ^
    "$headers = @{ 'Authorization' = 'Bearer ' + $token; 'Content-Type' = 'application/json' };" ^
    "Invoke-RestMethod -Uri $uri -Method Post -Body $body -Headers $headers"

REM Execute the master log SQL file with Latin-1 encoding
echo Executing init SQL file with Latin-1 encoding...
"%MYSQL_PATH%\mysql" -u%MYSQL_USER% -p"%MYSQL_PASSWORD%" --default-character-set=latin1 %MYSQL_DATABASE% < "%INIT_SQL_FILE%"


start http://localhost:4000/home


pause
