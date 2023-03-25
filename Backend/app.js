const express = require('express');
const app = express();
const models = require('./db/models');

// Import middlewares
const body_parser = require('body-parser');

// Global constants

global.port = 5500;

// Import routes
const proxy_routes = require('./proxy/proxy_routes.js');
const save_routes = require('./save/save_routes.js');

// Set json as the body parser

app.use(body_parser.json());

// Connect to the database
const db = require('./db/db');
const instance = db.client;

// Create new routes for proxy and save

app.use('/proxy', proxy_routes);
app.use('/save', save_routes);

// Add 404 error handler

app.all('*', (req, res) => {
    res.status(404).send('Not Found');
});

// Start the server

app.listen(global.port, () => {
    console.log(`Server started on port ${global.port}`);
});

// Set router
module.exports = app;