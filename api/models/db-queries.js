// get all Users from Users table (no params, selecting *).
const getAllUsersQuery = 'SELECT * FROM users ORDER BY updated_at;';

// get User matching a specific id (param: id).
const getUserByIdQuery = 'SELECT * FROM users WHERE user_id = ?;';

// get count of Users matching a specific set of Credentials (params: username or email, password, salt).
const getUserByEmailQuery = 'SELECT * FROM users WHERE email = ?;';

// create a new user
const createUserQuery = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?);';

// get all products of the store.
const getAllproductsQuery = 'SELECT * FROM products ORDER BY product_id;';

// create a new token
const createTokenQuery = 'INSERT INTO tokens (user_id, token, end_date) VALUES (?, ?, ?);';

// get token matching the user_id
const getTokenByUserIdQuery = 'SELECT * FROM tokens WHERE user_id = ?;';

// get token by token
const getTokenQuery = 'SELECT * FROM tokens WHERE token = ?;';

// Perform a database operation to delete the token
const deleteTokenQuery = 'DELETE FROM tokens WHERE token = ?';

// POST /api/products/{product_id}/like: Like a product.
const likeProductQuery = 'INSERT INTO likes (user_id, product_id, created_at) VALUES (?, ?, ?)';

// POST /api/products/{product_id}/unlike: Unlike a product.
const unlikeProductQuery = 'DELETE FROM likes WHERE user_id = ? AND product_id = ?';

// GET /api/products/:product_id/likes: Retrieve likes for a specific product.
const getProductLikesQuery = 'SELECT user_id, created_at FROM likes WHERE product_id = ?';

// POST /api/orders: Create a new order.
const createNewOrderQuery = 'INSERT INTO orders (user_id, product_id, date_ordered_at, quantity) VALUES (?, ?, ?, ?)';

// GET /api/orders/:order_id: Retrieve order details by order ID.
const getOrderDataQuery = 'SELECT * FROM orders WHERE order_id = ?';

// GET /api/users/:user_id/orders: Retrieve orders for a specific user.
const getUserOrdersDataQuery = 'SELECT * FROM orders WHERE user_id = ?';

// GET /api/products/:product_id/orders: Retrieve orders for a specific product.
const getOrdersOfProductQuery = 'SELECT * FROM orders WHERE product_id = ?';

// POST /api/products: Create a new product.
const createNewProductQuery = `INSERT INTO products (name, description, quantity_stocked, price, processor, ram, size, captor, weight, socket_cpu,dimension, others, connectivity, resolution, screen_type, vram, battery_power_time, type_id, storage, brand_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

// GET /api/products/:product_id: Retrieve product details by product ID.
const getProductByIdQuery = 'SELECT * FROM products WHERE product_id = ?';

// PUT /api/products/:product_id: Update product details.
const updateProductDataQuery = `
    UPDATE products
    SET name = ?, description = ?, quantity_stocked = ?, price = ?, processor = ?, ram = ?, size = ?, captor = ?, weight = ?,
        socket_cpu = ?, dimension = ?, others = ?, connectivity = ?, resolution = ?, screen_type = ?, vram = ?, battery_power_time = ?,
        type_id = ?, storage = ?, brand_id = ?, updated_at = CURRENT_TIMESTAMP
    WHERE product_id = ?
  `;

// DELETE /api/products/:product_id: Delete a product.
const deleteProductQuery = 'DELETE FROM products WHERE product_id = ?';

// POST /api/sales: Create a new sale - promotion.
const createNewSalesQuery = `
    INSERT INTO sales (product_id, sale_price, start_date, end_date)
    VALUES (?, ?, ?, ?)
  `;

// GET /api/sales/:user_id: Do users order products have sales-promotion.
const getUserOngoingSalesQuery = `
    SELECT s.* 
    FROM sales s
    JOIN likes l ON s.product_id = l.product_id
    WHERE l.user_id = ? AND s.start_date <= NOW() AND s.end_date >= NOW()
  `;

// GET /api/users/:user_id: Retrieve user details by user ID.
const getUserDataQuery = 'SELECT * FROM users WHERE user_id = ?';

// PUT /api/users/:user_id: Update user details.
const changeUserDataQuery = `
    UPDATE users
    SET username = ?, email = ?, country = ?, city = ?, zip_code = ?, street_name = ?, street_number = ?, address_complements = ?, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `;

// DELETE /api/users/:user_id: Delete a user.
const deleteUserQuery = 'DELETE FROM users WHERE user_id = ?';

// GET /api/product/top/:limit : Retrieve top products
const getPopularProducts='SELECT p.product_id, p.name, p.description, p.quantity_stocked, p.price, p.processor, p.ram, p.size, p.captor, p.weight, p.socket_cpu, p.dimension, p.others, p.connectivity, p.resolution, p.screen_type, p.vram, p.battery_power_time, p.storage,COUNT(l.product_id)  AS likes_count FROM products p JOIN likes l ON p.product_id = l.product_id GROUP BY p.product_id ORDER BY likes_count DESC LIMIT ?;'

// GET /api/orders/:user_id Retrieve user specified status order
const getOrderByStatusQuery ='SELECT * FROM orders WHERE user_id = ? AND status = ?'


const newPasswordQuery ='UPDATE users SET password_hash = ? WHERE user_id = ?;'

module.exports = {getAllUsersQuery,
    getUserByIdQuery,
    getUserByEmailQuery,
    createUserQuery,
    getAllproductsQuery,
    createTokenQuery,
    getTokenByUserIdQuery,
    getTokenQuery,
    deleteTokenQuery,
    likeProductQuery,
    unlikeProductQuery,
    getProductLikesQuery,
    createNewOrderQuery,
    getOrderDataQuery,
    getUserOrdersDataQuery,
    getOrdersOfProductQuery,
    createNewProductQuery,
    getProductByIdQuery,
    updateProductDataQuery,
    deleteProductQuery,
    createNewSalesQuery,
    getUserOngoingSalesQuery,
    getUserDataQuery,
    changeUserDataQuery,
    deleteUserQuery,
    getPopularProducts,
    getOrderByStatusQuery,
    newPasswordQuery};

