const router = require('express').Router();
const save_routes = require('./save/save_routes');

router.use('/save', save_routes);

// Add 404 error handler
router.all('*', (req, res) => {
    return res.status(404).send('SiteSlice API route not found');
});

// Export the router
module.exports = router;