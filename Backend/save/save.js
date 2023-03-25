const { validationResult } = require('express-validator');
const fs = require('fs');
const cheerio = require('cheerio');
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

// const FTP_FILE_PATH = "/public_html/index-basic.html";
// const FTP_FILE_NAME = "index-basic.html";

const FTP_FILE_PATH = "public_html/index.html";
const FTP_FILE_NAME = "index.html";

const save = async (req, res) => {

    console.log("Saving changes...");

    console.log(req.body.body["ftp_username"], req.body.body["ftp_password"], req.body.body["ftp_host"], req.body.body["ftp_port"]);

    // Validate the request

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    // Version 4, Login via FTP

    let file;
    try {
        ftp.getFile(FTP_FILE_PATH, FTP_FILE_NAME, req.body.body["ftp_username"], req.body.body["ftp_password"], req.body.body["ftp_host"], req.body.body["ftp_port"], async () => {
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

            console.log("Connected to database");

            // Iterate through the changes

            let $;

            try {
                $ = cheerio.load(file.toString());
                // console.log($.root().html())
                
                for(let i=0; i < req.body.body["changes"].length; i++) {
                    let change = req.body.body["changes"][i];
                    // For each change, get the xpath from the db given the uuid

                    let query = { uuid: change.uuid };
                    let result = await collection.findOne(query);
                    let element_selector = result.xpath;

                    let selector_str = String(element_selector);

                    function findItemWithCSSPath(cssPath) {
                        let all_elements = $('*');

                        for(let element of all_elements) {
                            if(getCSSPath(element) === selector_str) {
                                return element;
                            }
                        }
                    }

                    let item = findItemWithCSSPath(selector_str);

                    console.log('el uuid: ', change.uuid);
                    console.log('el selector: ', selector_str);

                    // Update the file via the xpath to reflect the change
                    // let item = $(selector_str);
                    /*console.log(item)
                    let all_the_h2s = $('h2');
                    
                    for(let h2 of all_the_h2s) {
                        console.log('[[h2]] ', $(h2).text(), getCSSPath(h2))
                        console.log('is NOT ', element_selector);
                        console.log($(element_selector).length, '\n')
                    }*/
                    // console.log('all the h2s: ', $('h2'))

                    $(item).html(change.new_inner_html);
                    //xpath.select(element_selector, doc)[0].firstChild.data = change.new_inner_html;
                }

            } catch (err) {
                return res.status(500).json({ message: "Error updating element: " + err.toString()});
            }

            // Save the file
            try {
                fs.writeFileSync("save/tmp/" + FTP_FILE_NAME, $.root().html());
            } catch (err) {
                return res.status(500).json({ message: "Error writing file: " + err.toString()});
            }

            // Version 4, Upload the file via FTP
            try {
                ftp.uploadFile(FTP_FILE_PATH, FTP_FILE_NAME,req.body.body["ftp_username"], req.body.body["ftp_password"], req.body.body["ftp_host"], req.body.body["ftp_port"], () => {
                    // Clean tmp folder

                    // const directory = "save/tmp";

                    // fs.readdir(directory, (err, files) => {
                    // if (err) throw err;

                    // for (const file of files) {
                    //     fs.unlink(path.join(directory, file), (err) => {
                    //     if (err) throw err;
                    //     });
                    // }
                    // });


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

function getCSSPath(el) {
    let path = [], parent;
    while (parent = el.parentNode) {
        path.unshift(`${el.tagName}:nth(${[].indexOf.call(parent.children, el)+1})`);
        el = parent;
    }
    return `${path.join(' > ')}`.toLowerCase();
}

module.exports = { 
    save
};