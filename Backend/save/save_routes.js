// Import router
const router = require('express').Router();
const cors = require('cors')
const { checkSchema } = require('express-validator');
const save = require('./save.js');


// CORS
// const corsOptions = {
//     origin: 'localhost:80', 
//     optionsSuccessStatus: 200
// }

// Create the save route



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

// Export the router
module.exports = router;