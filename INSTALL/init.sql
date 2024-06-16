INSERT INTO likes (user_id, product_id, created_at)
VALUES
(1, 1, NOW()),
(1, 2, NOW()),
(1, 3, NOW()),
(1, 4, NOW()),
(1, 5, NOW());

UPDATE products SET quantity_stocked = 10;

UPDATE sales SET reduction_percentage = 20 WHERE product_id = 1;
UPDATE sales SET reduction_percentage = 12 WHERE product_id = 2;
UPDATE sales SET reduction_percentage = 50 WHERE product_id = 17;
UPDATE sales SET reduction_percentage = 75 WHERE product_id = 100;
UPDATE sales SET reduction_percentage = 2 WHERE product_id = 86;
UPDATE sales SET reduction_percentage = 50 WHERE product_id = 25;