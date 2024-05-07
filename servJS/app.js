// Import the Express.js module
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Create an instance of Express.js
const app = express();
app.use(cors());


// Define a route
app.get('/', (req, res) => {
    res.send('Hello, World!');
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

// Define the port number
const port = 4000;

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
