// Import router
const router = require('express').Router();
const cors = require('cors')
const { checkSchema } = require('express-validator');
const save = require('./save.js');
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

// debug
// router.use((req, res, next) => {
//     console.log(`[SAVE ROUTES] ${req.method} ${req.hostname}${req.url}`)
// });

const save_schema = {
    url: {
        in: 'body',
        isString: true,
        // FIXME: Add when we are not using local files
        // isURL: true,
        errorMessage: 'Invalid URL'
    },
    ftp_username: {
        in: 'body',
        isString: true,
        errorMessage: 'Invalid FTP username'
    },
    ftp_password: {
        in: 'body',
        isString: true,
        errorMessage: 'Invalid FTP password'
    },
    ftp_host: {
        in: 'body',
        isString: true,
        errorMessage: 'Invalid FTP host'
    },
    ftp_port: {
        in: 'body',
        isInt: true,
        errorMessage: 'Invalid FTP port'
    },
    xpath: {
        in: 'body',
        isString: true,
        errorMessage: 'Invalid xpath'
    },
    changes: {
        in: 'body',
        isArray: true,
        errorMessage: 'Invalid changes'
    },
    'changes.*.uuid': {
        in: 'body',
        isUUID: 4,
        errorMessage: 'Invalid UUID'
    },
    'changes.*.old_inner_html': {
        in: 'body',
        isString: true,
        errorMessage: 'Invalid old inner html'
    },
    'changes.*.new_inner_html': {
        in: 'body',
        isString: true,
        errorMessage: 'Invalid new inner html'
    }
};

router.post('/', save.save);

// Add 404 error handler
router.all('*', (req, res) => {
    return res.status(404).send('SiteSlice save route not found');
});

// Export the router
module.exports = router;