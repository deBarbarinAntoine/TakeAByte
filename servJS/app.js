// Import the Express.js module
const express = require('express');
const cors = require('cors')

// Create an instance of Express.js
const app = express();
app.use(cors());


// Define a route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Define the port number
const port = 4000;

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
