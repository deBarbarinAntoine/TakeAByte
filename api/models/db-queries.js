// get all Users from Users table (no params, selecting *).
exports.getAllUsersQuery = 'SELECT * FROM users ORDER BY last_connection;';

// get User matching a specific id (param: id).
exports.getUserByIdQuery = 'SELECT * FROM users WHERE user_id = ?;';

// get count of Users matching a specific set of Credentials (params: username or email, password, salt).
exports.getUserByEmailQuery = 'SELECT * FROM users WHERE email = ?;';

// create a new user
exports.createUserQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?);';

// get all products of the store.
exports.getAllproductsQuery = 'SELECT * FROM products ORDER BY Id_products;';

// get all products matching a type from the store.
exports.getAllproductsByTypeQuery = 'SELECT * FROM products WHERE Type RLIKE ? ORDER BY Id_products;';