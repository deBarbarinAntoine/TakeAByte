-- Insert a new user with is_mod set to 1
INSERT INTO users (username, email, password_hash, country, city, zip_code, street_name, street_number,
                   address_complements, is_mod)
VALUES ('moderator_user', 'moderator@example.com', 'hashed_password', 'God_Land', 'Ynov-AIX', '13100', 'TakeAByte', 1,
        'Apt 402', 1);

-- Get the user_id of the newly inserted user
SET @user_id = LAST_INSERT_ID();

-- Generate a random token of 86 characters
SET @token = SUBSTRING(CONCAT(MD5(RAND()), MD5(RAND()), MD5(RAND()), MD5(RAND()), MD5(RAND())), 1, 86);

-- Insert the token into the tokens table
INSERT INTO tokens (user_id, end_date, token)
VALUES (@user_id, DATE_ADD(NOW(), INTERVAL 10 YEAR), @token);

-- Select the token to verify
SELECT @token;
