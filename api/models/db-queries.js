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

// Get /userLike/:user_id Retrieve user fav
const getUserFavQuery = 'SELECT product_id FROM likes WHERE user_id = ?';

// Define the query to create a new order
const createNewOrderQuery = 'INSERT INTO orders (user_id, date_ordered_at, status) VALUES (?, ?, ?)';

// Define the query to create new order items
const createNewOrderItemQuery = 'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)';

// GET /api/orders/:order_id: Retrieve order details by order ID.
const getOrderDataQuery = 'SELECT * FROM orders WHERE order_id = ?';

// GET /api/users/:user_id/orders: Retrieve orders for a specific user.
const getUserOrdersDataQuery = 'SELECT * FROM orders WHERE user_id = ?';

// GET /api/products/:product_id/orders: Retrieve orders for a specific product.
const getOrdersOfProductQuery = 'SELECT order_id FROM order_items WHERE product_id = ?';

// POST /api/products: Create a new product.
const createNewProductQuery = `
INSERT INTO products 
(airflow, aspect_ratio, autofocus, battery_power, battery_power_time, benefits, brand_id, business_oriented, camera, capacity, cellular, certification, compatibility, connectivity, cores, coverage, CPU, cpu_generation, curve, description, display, display_size, durability, features, film_format, form_factor, functions, g_sync_compatible, gaming_oriented, gps, grade, graphics_card, image, interfaces, keyboard, layout, lens_mount, lighting, materials, megapixels, microphone, name, noise_cancellation, noise_level, operating_system, options, panel_type, performance_focus, portability, power_consumption, price, quantity_stocked, RAM, refresh_rate, resolution, response_time, sales, screen_type, security_features, sensor, sensor_resolution, sensor_size, side_panel, size, smart_assistant, socket_compatibility, socket_cpu, speed, stabilization, storage_capacity, style, switch_type, sync_technology, target_audience, technology, touchscreen, type_id,uses, video_recording, wattage, weatherproof, weight, wifi, wifi_standard, zoom) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

// GET /api/products/:product_id: Retrieve product details by product ID.
const getProductByIdQuery = 'SELECT * FROM products WHERE product_id = ?';

// PUT /api/products/:product_id: Update product details.
const updateProductDataQuery = `
    UPDATE products
    SET airflow             = ?,
        aspect_ratio        = ?,
        autofocus           = ?,
        battery_power       = ?,
        battery_power_time  = ?,
        benefits            = ?,
        business_oriented   = ?,
        camera              = ?,
        capacity            = ?,
        cellular            = ?,
        certification       = ?,
        compatibility       = ?,
        connectivity        = ?,
        cores               = ?,
        coverage            = ?,
        CPU                 = ?,
        cpu_generation      = ?,
        curve               = ?,
        description         = ?,
        display             = ?,
        display_size        = ?,
        durability          = ?,
        features            = ?,
        film_format         = ?,
        form_factor         = ?,
        functions           = ?,
        g_sync_compatible   = ?,
        gaming_oriented     = ?,
        gps                 = ?,
        grade               = ?,
        graphics_card       = ?,
        image               = ?,
        interfaces          = ?,
        keyboard            = ?,
        layout              = ?,
        lens_mount          = ?,
        lighting            = ?,
        materials           = ?,
        megapixels          = ?,
        microphone          = ?,
        name                = ?,
        noise_cancellation  = ?,
        noise_level         = ?,
        operating_system    = ?,
        options             = ?,
        panel_type          = ?,
        performance_focus   = ?,
        portability         = ?,
        power_consumption   = ?,
        price               = ?,
        RAM                 = ?,
        refresh_rate        = ?,
        resolution          = ?,
        response_time       = ?,
        sales               = ?,
        screen_type         = ?,
        security_features   = ?,
        sensor              = ?,
        sensor_resolution   = ?,
        sensor_size         = ?,
        side_panel          = ?,
        size                = ?,
        smart_assistant     = ?,
        socket_compatibility= ?,
        socket_cpu          = ?,
        speed               = ?,
        stabilization       = ?,
        storage_capacity    = ?,
        style               = ?,
        switch_type         = ?,
        sync_technology     = ?,
        target_audience     = ?,
        technology          = ?,
        touchscreen         = ?,
        uses                = ?,
        video_recording     = ?,
        wattage             = ?,
        weatherproof        = ?,
        weight              = ?,
        wifi                = ?,
        wifi_standard       = ?,
        zoom                = ?,
        quantity_stocked    = ?,
        type_id             = ?,
        brand_id            = ?,
        updated_at          = CURRENT_TIMESTAMP
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
    WHERE l.user_id = ?
      AND s.start_date <= NOW()
      AND s.end_date >= NOW()
`;

// GET /api/users/:user_id: Retrieve user details by user ID.
const getUserDataQuery = 'SELECT user_id, username, email, created_at, updated_at, country, city, zip_code, street_name, street_number, address_complements , name, lastname, province FROM users WHERE user_id = ?';

const getUserPasswordQuery = 'SELECT password_hash FROM users WHERE user_id = ?'
// PUT /api/users/:user_id: Update user details.
const changeUserDataQuery = `
    UPDATE users
    SET username = ?,
        email = ?,
        country = ?,
        city = ?,
        zip_code = ?,
        street_name = ?,
        street_number = ?,
        address_complements = ?,
        province = ?,
        name = ?,
        lastname = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
`;

// DELETE /api/users/:user_id: Delete a user.
const deleteUserQuery = 'DELETE FROM users WHERE user_id = ?';

// GET /api/orders/:user_id Retrieve user specified status order
const getOrderByStatusQuery = 'SELECT * FROM orders WHERE user_id = ? AND status = ?'


const newPasswordQuery = 'UPDATE users SET password_hash = ? WHERE user_id = ?;'

// POST /api/brands: Create a new brand.
const creatBrandQuery = "INSERT INTO brands (name) VALUES (?)";

// GET /api/brands/:id: Get brand by ID.
const getBrandQuery = "SELECT * FROM brands WHERE brand_id IN (?)";

const getAllBrandsQuery = "SELECT * FROM brands";

// PUT /api/brands/:id: Update brand by ID.
const updateBrandQuery = "UPDATE brands SET name = ? WHERE brand_id = ?";

// PUT /api/brands/:id: Update brand by ID.
const deleteBrandQuery = "DELETE FROM brands WHERE brand_id = ?";

// POST /api/colors: Create a new color.
const creatColorQuery = "INSERT INTO colors (name) VALUES (?)";

// GET /api/colors/:id: Get color by ID.
const getColorQuery = "SELECT * FROM colors WHERE color_id = ?";

// PUT /api/colors/:id: Update color by ID.
const updateColorQuery = "UPDATE colors SET name = ? WHERE color_id = ?";

// PUT /api/colors/:id: Update color by ID.
const deleteColorQuery = "DELETE FROM colors WHERE color_id = ?";

// POST /api/types: Create a new type.types
const creatTypeQuery = "INSERT INTO types (name) VALUES (?)";

// GET /api/types/:id: Get type by ID.
const getTypeQuery = "SELECT * FROM types WHERE type_id = ?";

// PUT /api/types/:id: Update type by ID.
const updateTypeQuery = "UPDATE types SET name = ? WHERE type_id = ?";

// PUT /api/types/:id: Update type by ID.
const deleteTypeQuery = "DELETE FROM types WHERE type_id = ?";

// POST /api/images: Create a new Image.
const creatImageQuery = 'INSERT INTO images (image_path, ind, product_id) VALUES (?, ?, ?)';

// GET /api/images/:id: Get Image by ID.
const getImageQuery = 'SELECT * FROM images WHERE image_id = ?';

// Get /api/images/product/:id : Get all image for this product id
const getProductImageQuery = 'SELECT * FROM images WHERE product_id = ?';

// PUT /api/images/:id: Update Image by ID.
const updateImageQuery = 'UPDATE images SET image_path = ?, ind = ?, product_id = ? WHERE image_id = ?'

// DELETE /api/images/:id: Delete Image by ID.
const deleteImageQuery = 'DELETE FROM images WHERE image_id = ?'

// check for image validity
const checkImageIndQuery = "SELECT * FROM images WHERE product_id = ? AND ind = ?";
const checkImagePathQuery = "SELECT * FROM images WHERE image_path = ?";
//

// getter for name of Type and brand to create product
const getTypeIdByNameQuery = 'SELECT type_id FROM types WHERE name = ?'
const getBrandIdByNameQuery = 'SELECT brand_id FROM brands WHERE name = ?'
//

// Check if product already exist
const isExistingProduct = 'SELECT * FROM products WHERE name = ? AND brand_id = ?'

// GET user id from token
const getUserIdFromTokenQuery = 'SELECT user_id FROM tokens WHERE token = ?'

// GET token from user id
const getTokenFromUserIdQuery = 'SELECT token FROM tokens WHERE user_id = ?'

// Check if user is mod
const isModQuery = 'SELECT is_mod FROM users WHERE user_id = ?'

// Check if rest token is valid
const verifyResetTokenQuery = 'SELECT user_id FROM password_reset_tokens WHERE token = ? AND end_date > ?'

// Delete rest token
const deleteResetTokenQuery = 'DELETE FROM password_reset_tokens WHERE token = ?'

module.exports = {
    getUserPasswordQuery,
    getUserFavQuery,
    getAllBrandsQuery,
    getAllUsersQuery,
    deleteResetTokenQuery,
    verifyResetTokenQuery,
    getTokenFromUserIdQuery,
    isModQuery,
    getUserIdFromTokenQuery,
    isExistingProduct,
    getTypeIdByNameQuery,
    getBrandIdByNameQuery,
    checkImageIndQuery,
    checkImagePathQuery,
    creatImageQuery,
    getImageQuery,
    getProductImageQuery,
    updateImageQuery,
    deleteImageQuery,
    creatTypeQuery,
    getTypeQuery,
    updateTypeQuery,
    deleteTypeQuery,
    creatColorQuery,
    getColorQuery,
    updateColorQuery,
    deleteColorQuery,
    creatBrandQuery,
    updateBrandQuery,
    getBrandQuery,
    deleteBrandQuery,
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
    getOrderByStatusQuery,
    newPasswordQuery,
    createNewOrderItemQuery
};

