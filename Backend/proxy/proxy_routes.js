// Import router
const router = require('express').Router();
const proxy = require('./proxy');
const cors = require('cors');
const body_parser = require('body-parser');

// Global backend constants
const CONFIG = require('../../config');

// setup middleware

// cors
router.use(cors(CONFIG.BACKEND.CORS_OPTIONS));

// Set json as the body parser
router.use(body_parser.json());

// Parse url encoded params
router.use(body_parser.urlencoded({ extended: false }));

// TODO: add http regex
router.get(/^.*$/, proxy.proxy);

router.all((res, req) => {
    req.status(404).send('SiteSlice Proxy cannot not reach this URL');
})

// Export the router
module.exports = router;