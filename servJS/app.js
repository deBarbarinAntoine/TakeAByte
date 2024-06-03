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

// Serve static files
app.use('/static', express.static('./frontEnd/static'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Specify the directory where your EJS templates are located
app.set('views', path.join(__dirname, 'frontEnd', 'HTML'));

// In-memory storage for favorite items and cart items
let favoriteItems = [];
let cartItems = [];

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
app.get('/getCloseDeliveryPoint/:rayon/:latitude/:longitude', async (req, res) => {
    const {rayon,latitude,longitude } = req.params;
    const overpassApiUrl = 'https://overpass-api.de/api/interpreter';

    try {
        // Overpass API query
        const query = `
        [out:json][timeout:25];
        (
          node["amenity"="post_office"](around:${rayon},${latitude},${longitude});
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

// Define a route for the home page
app.get('/address', (req, res) => {
    res.render('index', { title: "Address and Delivery Point Finder" });
});

app.get('/fav', (req, res) => {
    res.render('fav&cart', { title: "shop app" });
});

// Route to set/unset a favorite item
app.get('/setFav/:id', (req, res) => {
    const itemId = req.params.id;

    if (!itemId) {
        return res.status(400).send('Item ID is required');
    }

    const itemIndex = favoriteItems.indexOf(itemId);
    if (itemIndex > -1) {
        // Item is already in favorites, remove it
        favoriteItems.splice(itemIndex, 1);
        res.send(`Toggle favorite item ${req.params.id}`,`Item ${itemId} removed from favorites`);
    } else {
        // Item is not in favorites, add it
        favoriteItems.push(itemId);
        res.send(`Toggle favorite item ${req.params.id}`,`Item ${itemId} added to favorites`);
    }
});

// Route to add/remove an item to/from the cart
app.get('/addToCart/:id', (req, res) => {
    const itemId = req.params.id;

    if (!itemId) {
        return res.status(400).send('Item ID is required');
    }

    const itemIndex = cartItems.indexOf(itemId);
    if (itemIndex > -1) {
        // Item is already in cart, remove it
        cartItems.splice(itemIndex, 1);
        res.send(`Toggle cart item ${req.params.id}`,`Item ${itemId} removed from cart`,);
    } else {
        // Item is not in cart, add it
        cartItems.push(itemId);
        res.send(`Toggle cart item ${req.params.id}`,`Item ${itemId} added to cart`);
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
