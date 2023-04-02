const express = require('express');
const cors = require('cors');
const vhost = require('vhost');
const models = require('./db/models');
const utils = require('./utils/utils');
const {api_app, api_server} = require('./api_server');
const {proxy_app, proxy_server} = require('./proxy/proxy_server');

// Import middlewares
const querystring = require('querystring');

// Global backend constants
const CONFIG = require('../config');

console.log('config loaded!');
console.log(CONFIG);

// Import routes
const proxy_routes = require('./proxy/proxy_routes.js');
const api_routes = require('./api_routes.js');

// *** ANCHOR SETUP ***
const app = express();

// app.use((req, res, next) => {
//     console.log(`[BACKEND] ${req.method} ${req.hostname}${req.url}`)
//     next()
// });

// TODO: Do the vhost via directly splitting up services into subapps (for better scalability per service usage) and/or Nginx vhost (for better performance in general than Node.js)
app.use(vhost(new RegExp(`([-a-zA-Z0-9@:%._\+~#=]{0,256})${utils.preg_quote(CONFIG.API_HOSTNAME)}`, 'g'), function handle (req, res, next) {
    console.log(`|  ${req.url}`);
    console.log('-> Forwarding to API server');
    api_server.emit('request', req, res);
}))
app.use(vhost(new RegExp(`([-a-zA-Z0-9@:%._\+~#=]{0,256})${utils.preg_quote(CONFIG.PROXY_HOSTNAME)}.*`, 'g'), function handle (req, res, next) {
    console.log(`|  ${req.url}`);
    console.log('-> Forwarding to proxy server');
    proxy_server.emit('request', req, res);
}))

app.all('*', (req, res) => res.status(500).send('Uncaught 404!'));

// app.use(vhost(CONFIG.API_HOSTNAME, api_routes))
// app.use(vhost(CONFIG.PROXY_HOSTNAME, proxy_routes))

// Connect to the database
console.log('Connecting to database...');
const db = require('./db/db');
console.log('Connected!');


// *** ANCHOR START SERVER ***
app.listen(CONFIG.BACKEND_PORT, () => {
    console.log(`Backend started on port ${CONFIG.BACKEND_PORT}`);
});

// Set router
module.exports = {
    app
};