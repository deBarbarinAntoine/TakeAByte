INSERT INTO likes (user_id, product_id, created_at)
VALUES
(1, 1, NOW()),
(1, 2, NOW()),
(1, 3, NOW()),
(1, 4, NOW()),
(1, 5, NOW());

UPDATE products SET quantity_stocked = 10;

INSERT INTO sales (product_id, reduction_percentage, start_date, end_date)
VALUES (1, 20.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH));

INSERT INTO sales (product_id, reduction_percentage, start_date, end_date)
VALUES (10, 2.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH));

INSERT INTO sales (product_id, reduction_percentage, start_date, end_date)
VALUES (100, 25.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH));

INSERT INTO sales (product_id, reduction_percentage, start_date, end_date)
VALUES (72, 75.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH));

INSERT INTO sales (product_id, reduction_percentage, start_date, end_date)
VALUES (18, 32.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH));

INSERT INTO sales (product_id, reduction_percentage, start_date, end_date)
VALUES (52, 25.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH));

INSERT INTO sales (product_id, reduction_percentage, start_date, end_date)
VALUES (80, 18.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH));

INSERT INTO users (
    username, email, password_hash, name, lastname, province, country, city, zip_code, street_name, street_number, address_complements, is_mod
) VALUES ( 'user_zero', 'user_zero@example.com', 'hashed_password', 'First', 'Last', 'Province', 'CNY', 'City', '12345', 'Street', 123, 'Apt 1', 0
         );
UPDATE `users` SET `user_id` = '0' WHERE `users`.`username` = 'user_zero'