const axios = require('axios');

const getCloseDeliveryPoint = async (req, res) => {
    const { rayon, latitude, longitude } = req.params;
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
};

module.exports = { getCloseDeliveryPoint };
