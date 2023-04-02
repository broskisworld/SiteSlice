// const fs = require('fs');
const http = require('http');
// const https = require('https');
const express = require('express');
const proxy_routes = require('./proxy_routes');

// config
const CONFIG = require('../../config');

let proxy_app = express();

proxy_app.use('/', proxy_routes);

let proxy_server = http.createServer(proxy_app);

// For http
proxy_server.listen(CONFIG.BACKEND.PROXY_PORT);

module.exports = {
    proxy_app,
    proxy_server
}