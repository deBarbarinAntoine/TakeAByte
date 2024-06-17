# TakeAByte

---

## Installation

To set up the project, follow these steps:

1. **`SQL/BIN` Path Preparation:** Ensure you have the full path to the `SQL/bin` directory. This directory contains essential SQL files for initializing the database and managing logs. The path should look like `C://wamp/bin/sql/mysql+version/bin` if you're using wamp, else `C://mysql+version/bin`. No trailing slash


2. **TakeaByte Doc Path Preparation:** Obtain the full path to the TakeaByte doc. The path should look like `C:///path/to/TakeAByte`. No trailing slash!


3. **Initialization SQL File:** The initialization SQL file (`init.sql`) is crucial for setting up the initial database schema and configurations. Ensure you have this file in the "INSTALL" folder.


4. **Master Log SQL File:** The master log SQL file (`master_log.sql`) is used for tracking database changes and updates. Ensure you have this file in the "INSTALL" folder.


5. **Web Market File:** The Web Market file is the sql file in which the script used to create the database is located. Ensure you have this file in the "INSTALL" folder.


6. **Cookies:** Please assure that your cookies for `localhost:4000` are cleared for test purpose as it's still not implemented in the script.


7. **Database Name:** Please assure that you don't type a database name already in use.

8. **SQL ON ?:** Remember to start your SQL system, whether it's Wamp or another service.

9. **Ready ?:** Once you're all ready , start the `setup_database.bat` for WINDOWS based system or `setup_database_Linux.sh`for LINUX based system (don't forget to run command `chmod +x setup_database_Linux.sh` to make it executable), in the `INSTALL` folder and follow the instructions.

---

## Usage

Note: All requested passwords are for the first account unless for a new user.

Note: The new user only has access to the newly created database.

---

## Support

If you encounter any issues or need further assistance, feel free to reach out to our support team at [mail@adebarbarin.com].
