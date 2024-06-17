#!/bin/bash

set -e

read -p "Enter the full path to TakeAByte directory (e.g., /home/user/TakeAByte): " TAKEABYTE_PATH

# Check if the specified directory exists
if [ ! -d "$TAKEABYTE_PATH" ]; then
    echo "The specified directory does not exist. Please check the path and try again."
    exit 1
fi

# Set fixed paths relative to TakeAByte directory
TAKEABYTE_INSTALL_PATH="$TAKEABYTE_PATH/INSTALL"
SQL_FILE="$TAKEABYTE_INSTALL_PATH/web-market-table.sql"
MASTER_SQL_FILE="$TAKEABYTE_INSTALL_PATH/master_log.sql"
INIT_SQL_FILE="$TAKEABYTE_INSTALL_PATH/init.sql"

echo "Reading SQL file: $SQL_FILE"
echo "Reading master log SQL file: $MASTER_SQL_FILE"
echo "Reading init SQL file: $INIT_SQL_FILE"

read -p "Enter the full path to your MySQL bin directory (e.g., /usr/bin): " MYSQL_PATH

# Check if the specified MySQL bin directory exists
if [ ! -x "$MYSQL_PATH/mysql" ]; then
    echo "MySQL executable not found in the specified directory. Please check the path and try again."
    exit 1
fi

echo "MySQL found at $MYSQL_PATH"

read -p "Enter MySQL username: " MYSQL_USER

# Use read command to securely prompt for password
read -s -p "Enter MySQL password: " MYSQL_PASSWORD
echo ""

read -p "Enter database name: " MYSQL_DATABASE
read -p "Enter new MySQL username: " NEW_MYSQL_USER

# Use read command to securely prompt for new user password
read -s -p "Enter new MySQL user password: " NEW_MYSQL_USER_PASSWORD
echo ""

# Check if SQL files exist
if [ ! -f "$SQL_FILE" ]; then
    echo "The specified SQL file does not exist."
    exit 1
fi
if [ ! -f "$MASTER_SQL_FILE" ]; then
    echo "The specified master log SQL file does not exist."
    exit 1
fi

# Create database if it does not exist with Latin-1 encoding
echo "Creating database if it does not exist with Latin-1 encoding..."
"$MYSQL_PATH/mysql" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci"

# Create new MySQL user and grant privileges
echo "Creating new MySQL user and granting privileges..."
"$MYSQL_PATH/mysql" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "CREATE USER '$NEW_MYSQL_USER'@'localhost' IDENTIFIED BY '$NEW_MYSQL_USER_PASSWORD';"
"$MYSQL_PATH/mysql" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "GRANT ALL PRIVILEGES ON $MYSQL_DATABASE.* TO '$NEW_MYSQL_USER'@'localhost';"
"$MYSQL_PATH/mysql" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "FLUSH PRIVILEGES;"

# Execute the initial SQL file with Latin-1 encoding
echo "Executing SQL file with Latin-1 encoding..."
"$MYSQL_PATH/mysql" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" --default-character-set=latin1 "$MYSQL_DATABASE" < "$SQL_FILE"

if [ $? -ne 0 ]; then
    echo "Error occurred during initial SQL file execution"
    exit 1
else
    echo "Initial SQL file executed successfully"
fi

# Execute the master log SQL file with Latin-1 encoding
echo "Executing master log SQL file with Latin-1 encoding..."
"$MYSQL_PATH/mysql" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" --default-character-set=latin1 "$MYSQL_DATABASE" < "$MASTER_SQL_FILE"

TOKENMOD="9NM6BNOKkU_19LPimOQkKEifZxcIXQyDhKftMOAZrckVcU_RzP-969q7DhIEedf4DStVpy9xSNKZ7QIal1uUCQ"

echo "The generated token is: $TOKENMOD"

# Set paths relative to servJS and api directories under TakeAByte
SERVJS_PATH="$TAKEABYTE_PATH/servJS"
API_PATH="$TAKEABYTE_PATH/api"

# Check if the servJS and api directories exist
if [ ! -d "$SERVJS_PATH" ]; then
    echo "The specified TakeAByte/servJS folder does not exist. Please check the path and try again."
    exit 1
fi
if [ ! -d "$API_PATH" ]; then
    echo "The specified TakeAByte/api folder does not exist. Please check the path and try again."
    exit 1
fi

# Delete existing .env file if it exists
rm -f "$API_PATH/.env"

# Create .env file with required environment variables for API
{
    echo "DB_HOST=localhost"
    echo "DB_USER=$NEW_MYSQL_USER"
    echo "DB_PASSWORD=$NEW_MYSQL_USER_PASSWORD"
    echo "DB_DATABASE=$MYSQL_DATABASE"
    echo "PORT=3001"
    echo "TOKEN_EXPIRY_HOURS=24"
} > "$API_PATH/.env"

# Delete existing data.env file if it exists
rm -f "$SERVJS_PATH/backEnd/data.env"

# Create data.env file with required environment variables for servJS
{
    echo "# Yelp API Key"
    echo "YELP_API_KEY=oKVpja6MbYoVopKZDk81RsC4QMerf_ZTuYE1VIcKD9P1Im91oDAZPOs8fiuE5WIEsbRkreeSxkac7UqHaEjzvXOlYGP5qBI-IgjJfuZGtao3xPkp3jROETpgSiFHZnYx"
    echo ""
    echo "# Port number for the server"
    echo "PORT=4000"
    echo ""
    echo "# Web Site admin token"
    echo "WEB_TOKEN=$TOKENMOD"
    echo ""
    echo "# Allan API TOKEN"
    echo "ALLAN_TOKEN=05fe835b-ec44-47b3-8a7f-795c089119e2"
} > "$SERVJS_PATH/backEnd/data.env"

# Call the script to start npm in servJS in a separate console window
echo "Calling script to start npm in servJS..."
gnome-terminal -- bash -c "$SERVJS_PATH/start_servJS.sh; exec bash"

# Call the script to start npm in api in a separate console window
echo "Calling script to start npm in api..."
gnome-terminal -- bash -c "$API_PATH/start_api.sh; exec bash"

# product data file
PRODUCT_DATA_FILE="$TAKEABYTE_PATH/INSTALL/products.json"

# Check if the specified product data file exists
if [ ! -f "$PRODUCT_DATA_FILE" ]; then
    echo "The specified product data file does not exist."
    exit 1
fi

# Echo the generated token
echo "The generated token is: $TOKENMOD"

# Make the HTTP POST request to add products
echo "Making HTTP POST request to add products..."
TOKENMOD="$TOKENMOD" URI="http://localhost:3001/v1/products" BODY="$(cat "$PRODUCT_DATA_FILE")" \
    bash -c 'curl -X POST -H "Authorization: Bearer $TOKENMOD" -H "Content-Type: application/json" -d "$BODY" "$URI"'

# Execute the init SQL file with Latin-1 encoding
echo "Executing init SQL file with Latin-1 encoding..."
"$MYSQL_PATH/mysql" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" --default-character-set=latin1 "$MYSQL_DATABASE" < "$INIT_SQL_FILE"

xdg-open http://localhost:4000/home

read -p "Press any key to continue..." -n1 -s
echo ""
