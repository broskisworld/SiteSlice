// Import router
const router = require('express').Router();

// Create the save route
router.post('/', (req, res) => {
    res.send('NOT IMPLEMENTED: Save POST route' + req.body);
});

// Export the router
module.exports = router;