// get all Users from Users table (no params, selecting *).
exports.getAllUsersQuery = 'SELECT * FROM users ORDER BY Visited_at';

// get User matching a specific id (param: id).
exports.getUserByIQuery = 'SELECT * FROM users WHERE Id_users = ?';

// get count of Users matching a specific set of Credentials (params: username or email, password, salt).
exports.getUserByEmailQuery = 'SELECT * FROM users WHERE Email = ?';

// get all products of the store.
exports.getAllproductsQuery = 'SELECT * FROM products ORDER BY Product_id';

// get all products matching a type from the store.
exports.getAllproductsByTypeQuery = 'SELECT * FROM products WHERE type RLIKE ? ORDER BY Product_id';