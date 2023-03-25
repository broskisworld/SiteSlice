const axios = require('axios');

const proxy = (async (req, res) => {
    res.send('Proxy GET route.\nParams sent: ' + req.url);

    // Download url files
    let url = req.url;
    let original_url_response = await axios.get(url);

    console.log(original_url_response.data);

    // UUID elements

    // Proxy links

    // Add Injectables.js
});

module.exports = {
    proxy
}