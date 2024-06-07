const axios = require('axios');

const getAddressSuggestions = async (req, res) => {
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
};

module.exports = { getAddressSuggestions };
