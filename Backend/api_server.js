// const fs = require('fs');
const http = require('http');
// const https = require('https');
const express = require('express');
const api_routes = require('./api_routes');

// config
const CONFIG = require('../config');

let api_app = express();

api_app.use('/', api_routes);

let api_server = http.createServer(api_app);

module.exports = {
    api_app,
    api_server
}