// Import the necessary modules and configure environment variables
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'data.env') });
const express = require('express');
const cors = require('cors');
const axios = require('axios');

require('ejs');

// Create an instance of Express.js
const app = express();
app.use(cors());

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Specify the directory where your EJS templates are located
app.set('views', path.join(__dirname, 'frontEnd', 'HTML'));

// Define a route to get address suggestions
app.get('/getAddress/:address', async (req, res) => {
    const address = req.params.address;
    const apiUrl = 'https://nominatim.openstreetmap.org/search';

    try {
        const response = await axios.get(apiUrl, {
            params: {
                q: address,
                format: 'json'
            }
        });

        const suggestions = response.data.map(result => ({
            address: result.display_name,
            latitude: result.lat,
            longitude: result.lon
        }));

        res.json({ suggestions });

    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Define a route to get close delivery points
app.get('/getCloseDeliveryPoint/:latitude/:longitude', async (req, res) => {
    const {latitude,longitude } = req.params;
    const overpassApiUrl = 'https://overpass-api.de/api/interpreter';

    try {
        // Overpass API query
        const query = `
        [out:json][timeout:25];
        (
          node["amenity"="post_office"](around:1000,${latitude},${longitude});
        );
        out body;
        >;
        out skel qt;
        `;

        // Sending the request to the Overpass API
        const response = await axios.get(overpassApiUrl, {
            params: {
                data: query
            }
        });

        // Parsing the response
        const deliveryPoints = response.data.elements.map(element => ({
            name: element.tags.name || 'Unnamed',
            latitude: element.lat,
            longitude: element.lon,
            opening_hours: element.tags.opening_hours,
        }));

        res.json({ deliveryPoints });

    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});


// Define a route for the 404 page
app.get('*', (req, res) => {
    res.render('404', { title: "Error not found 404 I'm a teapot 418" });
});

// Define the port number using environment variables for flexibility
const port = process.env.PORT || 4000;

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
