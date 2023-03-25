const { validationResult } = require('express-validator');
const fs = require('fs');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;


const TESTBENCH_PATH = '/Users/borkson/Code/HackUSU/SiteSlice/Frontend/Testbench/Basic-site/index.html';
const TEST_XPATH_H1 = '/html/body/h1';
const TEST_XPATH_P = '/html/body/p';

const update_element_xpath = (element_xpath, new_inner_html) => {
    let doc = new dom().parseFromString(fs.readFileSync(TESTBENCH_PATH, 'utf8'));
    xpath.select(element_xpath, doc)[0].firstChild.data = new_inner_html;
    fs.writeFileSync(TESTBENCH_PATH, doc.toString());
};

const save = (req, res) => {
    // Validate the request

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    // TODO: Step 5, Build xpath update function
    
    update_element_xpath(TEST_XPATH_H1, 'Lick my tits');

    // Version 4, Login via FTP

    // Look for the file locally based on the url passed in, NEXT STEP

    // Iterate through the changes

    // For each change, get the xpath from the db given the uuid

    // Update the file via the xpath to reflect the change

    res.send('NOT IMPLEMENTED: Save POST route ' + JSON.stringify(req.body));
};

module.exports = { 
    save
};