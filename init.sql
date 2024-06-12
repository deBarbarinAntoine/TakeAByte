INSERT INTO likes (user_id, product_id, created_at)
VALUES
(1, 1, NOW()),
(1, 2, NOW()),
(1, 3, NOW()),
(1, 4, NOW()),
(1, 5, NOW());

UPDATE products SET quantity_stocked = 10;
