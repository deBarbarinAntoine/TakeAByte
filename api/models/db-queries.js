// get all Users from Users table (no params, selecting *).
exports.getAllUsersQuery = 'SELECT * FROM users ORDER BY Visited_at';

// get User matching a specific id (param: id).
exports.getUserByIQuery = 'SELECT * FROM users WHERE Id_users = ?';

// get count of Users matching a specific set of Credentials (params: username or email, password, salt).
exports.getUserByEmailQuery = 'SELECT * FROM users WHERE Email = ?';