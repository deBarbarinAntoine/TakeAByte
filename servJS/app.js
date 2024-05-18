// Import the Express.js module
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const ejs = require('ejs');
const path = require('path');

// Create an instance of Express.js
const app = express();
app.use(cors());

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Specify the directory where your EJS templates are located (optional)
app.set('views', path.join(__dirname, 'frontEnd', 'HTML'));

app.get('*', (req, res) => {
    res.render('404', { title: 'Error not found 404 i\'m a teapot 418' });
});


app.get('/getAddress/:address', async (req, res) => {
const address = req.params.address;
const apiUrl = 'https://nominatim.openstreetmap.org/search';

try{
    const response = await axios.get(apiUrl,{
        params: {
            q:address,
            format:'json'
        }
    });
    const Suggestions = response.data.map(result => ({
        address: result.display_name,
        latitude: result.lat,
        longitude: result.lon
    }));

    const Data ={
        Suggestions: Suggestions,
    }
    res.json(Data);

}catch(err){
    console.error('Error:',err.message)
    res.status(500).send({error :'Internal Server Error'});
}
})

app.get('/getCloseDeliveryPoint/:longitude/:latitude', async (req, res) => {
    const { longitude, latitude } = req.params;
    const yelpApiUrl = 'https://api.yelp.com/v3/businesses/search';
    const yelpApiKey = 'oKVpja6MbYoVopKZDk81RsC4QMerf_ZTuYE1VIcKD9P1Im91oDAZPOs8fiuE5WIEsbRkreeSxkac7UqHaEjzvXOlYGP5qBI-IgjJfuZGtao3xPkp3jROETpgSiFHZnYx';
    try {
        const response = await axios.get(yelpApiUrl, {
            headers: {
                'Authorization': `Bearer ${yelpApiKey}`
            },
            params: {
                longitude: longitude,
                latitude: latitude,
                radius: 1000, // Search within 1000 meters
                categories: 'food,delivery', // Categories for food and delivery
                limit: 10 // Limit results to 10 places
            }
        });

        const places = response.data.businesses.map(business => ({
            name: business.name,
            address: business.location.address1,
            city: business.location.city,
            latitude: business.coordinates.latitude,
            longitude: business.coordinates.longitude,
            phone: business.phone,
            rating: business.rating,
            review_count: business.review_count,
            url: business.url
        }));

        res.json({ places });

    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Define the port number
const port = 4000;

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
