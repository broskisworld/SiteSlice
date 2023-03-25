const { validationResult } = require('express-validator');
const fs = require('fs');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const client = require('../db/db').client;

const DB_NAME = "SiteSliceDB";
const DB_COLLECTION = "elements";

// Test event
// {
//     "url": "https://www.testsite.com/page.html",
//     "uuid": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
//     "xpath": "/html/body/p",
//     "inner_html": "This is a test paragraph" // This is not needed but could be nice
// }

const save = async (req, res) => {

    // Validate the request

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    // Version 4, Login via FTP

    // Version 2, Look for the file locally based on the url passed in

    let file;

    try{
        file = fs.readFileSync(req.body.url, 'utf8');
    } catch (err) {
        return res.status(400).json({ message: "File " + req.body.url + " does not exist."});
    }

    // Access database
    let db;
    let collection;

    try {
        db = client.db(DB_NAME);
        collection = db.collection(DB_COLLECTION);
    } catch (err) {
        return res.status(500).json({ message: "Error connecting to database: " + err.toString()});
    }

    // Iterate through the changes

    let doc;

    try {
        doc = new dom().parseFromString(file);
        
        for(let i=0; i < req.body.changes.length; i++) {
            let change = req.body.changes[i];
            // For each change, get the xpath from the db given the uuid

            let query = { uuid: change.uuid };
            let result = await collection.findOne(query);
            let element_xpath = result.xpath;
            
            // Update the file via the xpath to reflect the change
            xpath.select(element_xpath, doc)[0].firstChild.data = change.new_inner_html;
        }

    } catch (err) {
        return res.status(500).json({ message: "Error updating element: " + err.toString()});
    }

    // Save the file
    try {
        fs.writeFileSync(req.body.url, doc.toString());
    } catch (err) {
        return res.status(500).json({ message: "Error writing file: " + err.toString()});
    }

    return res.status(200).json({ message: "Success" });
};

module.exports = { 
    save
};