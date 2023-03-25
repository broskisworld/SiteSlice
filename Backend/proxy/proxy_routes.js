// Import router
const router = require('express').Router();

// Create the proxy route
// TODO: add http regex
router.get(/^.*$/, (req, res) => {
    res.send('NOT IMPLEMENTED: Proxy GET route.\nParams sent: ' + req.url);
});

// Export the router
module.exports = router;