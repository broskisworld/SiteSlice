const { validationResult } = require('express-validator');
const fs = require('fs');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const client = require('../db/db').client;
const ftp = require('./ftp');
const path = require("path");

const DB_NAME = "SiteSliceDB";
const DB_COLLECTION = "elements";

// Test event
// {
//     "url": "https://www.testsite.com/page.html",
//     "uuid": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
//     "xpath": "/html/body/p",
//     "inner_html": "This is a test paragraph"
// }

const FTP_FILE_PATH = "/public_html/index-basic.html";
const FTP_FILE_NAME = "index-basic.html";

const save = async (req, res) => {

    // Validate the request

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    // Version 4, Login via FTP

    let file;
    try {
        ftp.getFile(FTP_FILE_PATH, FTP_FILE_NAME, req.body.ftp_username, req.body.ftp_password, req.body.ftp_host, req.body.ftp_port, async () => {
            file = fs.readFileSync("save/tmp/" + FTP_FILE_NAME);

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
                doc = new dom().parseFromString(file.toString());
                
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
                fs.writeFileSync("save/tmp/" + FTP_FILE_NAME, doc.toString());
            } catch (err) {
                return res.status(500).json({ message: "Error writing file: " + err.toString()});
            }

            // Version 4, Upload the file via FTP
            try {
                ftp.uploadFile(FTP_FILE_PATH, "save/tmp/" + FTP_FILE_NAME,req.body.ftp_username, req.body.ftp_password, req.body.ftp_host, req.body.ftp_port, () => {
                    // Clean tmp folder

                    const directory = "save/tmp";

                    fs.readdir(directory, (err, files) => {
                    if (err) throw err;

                    for (const file of files) {
                        fs.unlink(path.join(directory, file), (err) => {
                        if (err) throw err;
                        });
                    }
                    });


                    return res.status(200).json({ message: "Success" });
                });
            } catch (err) {
                return res.status(400).json({ message: "Error uploading file: " + err.toString()});
            }

        });
    } catch (err) {
        return res.status(400).json({ message: "Error getting file: " + err.toString()});
    }
};

module.exports = { 
    save
};