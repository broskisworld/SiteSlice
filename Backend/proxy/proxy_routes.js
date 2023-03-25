// Import router
const router = require('express').Router();
const proxy = require('./proxy');

// Create the proxy route
// TODO: add http regex
router.get(/^.*$/, proxy.proxy);

// Export the router
module.exports = router;