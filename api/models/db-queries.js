// get all Users from Users table (no params, selecting *).
const getAllUsersQuery = 'SELECT * FROM users ORDER BY updated_at;';

// get User matching a specific id (param: id).
const getUserByIdQuery = 'SELECT * FROM users WHERE user_id = ?;';

// get count of Users matching a specific set of Credentials (params: username or email, password, salt).
const getUserByEmailQuery = 'SELECT * FROM users WHERE email = ?;';

// create a new user
const createUserQuery = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?);';

// get all products of the store.
const getAllproductsQuery = 'SELECT * FROM products ORDER BY Id_products;';

// get all products matching a type from the store.
const getAllproductsByTypeQuery = 'SELECT * FROM products WHERE Type RLIKE ? ORDER BY Id_products;';

// create a new token
const createTokenQuery = 'INSERT INTO tokens (user_id, token, end_date) VALUES (?, ?, ?);';

// get token matching the user_id
const getTokenByUserIdQuery = 'SELECT * FROM tokens WHERE user_id = ?;';

// get token by token
const getTokenQuery = 'SELECT * FROM tokens WHERE token = ?;';

module.exports = {getAllUsersQuery,
    getUserByIdQuery,
    getUserByEmailQuery,
    createUserQuery,
    getAllproductsQuery,
    getAllproductsByTypeQuery,
    createTokenQuery,
    getTokenByUserIdQuery,
    getTokenQuery};