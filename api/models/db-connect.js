const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

connection.getConnection()
    .then(() => console.log('Connected to MySQL database'))
    .catch((err) => console.error('Error connecting to MySQL:', err));

module.exports = connection;