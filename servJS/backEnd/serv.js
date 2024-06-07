// Import the necessary modules and configure environment variables
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'data.env') });
const express = require('express');
const cors = require('cors');

// Import routes
const apiRoutes = require('./routes/apiRoutes');
const displayRoutes = require('./routes/displayRoutes');

// Create an instance of Express.js
const app = express();
app.use(cors());

// Serve static files
app.use('/static', express.static(path.resolve(__dirname, '../frontEnd/static')));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Specify the directory where your EJS templates are located
app.set('views', path.resolve(__dirname, '../frontEnd/HTML'));

// Use routes
app.use('/api', apiRoutes);
app.use('/', displayRoutes);

// Define the port number using environment variables for flexibility
const port = process.env.PORT || 4000;

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
