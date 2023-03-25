const express = require('express');
const cors = require('cors')
const app = express();
const models = require('./db/models');

// Import middlewares
const body_parser = require('body-parser');
const querystring = require('querystring');

// Global constants
const CONFIG = {
    SAVE_API_PORT: 5500,
    PROXY_SERVICE_PORT: 5600
};

// // CORS
const corsOptions = {
    origin: 'http://localhost',
    optionsSuccessStatus: 200,
    methods: 'GET, PUT, OPTIONS, POST'
}
app.use(cors(corsOptions))

// Import routes
const proxy_routes = require('./proxy/proxy_routes.js');
const save_routes = require('./save/save_routes.js');

// *** ANCHOR SETUP ***
const save_api_app = express();
const proxy_service_app = express();

// Set json as the body parser
save_api_app.use(body_parser.json());
proxy_service_app.use(body_parser.json());

// Parse url encoded params
save_api_app.use(body_parser.urlencoded({ extended: false }));
proxy_service_app.use(body_parser.urlencoded({ extended: false }));

// Connect to the database
console.log('Connecting to database...');
const db = require('./db/db');
console.log('Connected!');

// Create new routes for proxy and save
save_api_app.use('/save', save_routes);
proxy_service_app.use('/', proxy_routes);

// Add 404 error handler
save_api_app.all('*', (req, res) => {
    res.status(404).send('Not Found');
});

// *** ANCHOR START SERVER ***
save_api_app.listen(CONFIG.SAVE_API_PORT, () => {
    console.log(`Save API started on port ${CONFIG.SAVE_API_PORT}`);
});
proxy_service_app.listen(CONFIG.PROXY_SERVICE_PORT, () => {
    console.log(`Proxy service started on port ${CONFIG.PROXY_SERVICE_PORT}`);
});

// Set router
module.exports = {
    save_api_app,
    proxy_service_app
};