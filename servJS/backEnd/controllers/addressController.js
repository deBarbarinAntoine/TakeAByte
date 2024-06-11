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

        const suggestions = response.data.map(result => {
            // Remove numbers from the address
            const addressWithoutNumbers = result.display_name.trim();
            return {
                result: {
                    address: addressWithoutNumbers,
                    latitude: result.lat,
                    longitude: result.lon
                }
            };
        });

        res.json(suggestions.map(suggestion => suggestion.result));
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send({error: 'Internal Server Error'});
    }
};

module.exports = {getAddressSuggestions};
