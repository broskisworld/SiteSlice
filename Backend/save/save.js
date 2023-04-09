const { validationResult } = require('express-validator');
const fs = require('fs');
const cheerio = require('cheerio');
const client = require('../db/db').client;
const ftp = require('./ftp');
const path = require("path");

const DB_NAME = "SiteSliceDB";
const DB_COLLECTION = "elements";

const COMMON_PATHS = [
    "public_html",
    "www",
    "var/www",
    "usr/share/nginx/html",
    "usr/share/nginx/www",
    //"*.com/public_html",
];

const COMMON_FILE_NAMES = [
    "index.html",
];

const save = async (req, res) => {

    console.log("Saving changes...");

    console.log("Body: ", req.body);

    // Validate the request

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    // 11MVP - Search for element (file) in database

    console.log("Searching for file in database...");

    let ftp_potential_files = [];

    for(let path of COMMON_PATHS) {
        try{
            let files = await ftp.listFiles(path, ftp_username, ftp_password, ftp_host, ftp_port);
            for(let file of files) {
                console.log("File: ", file.name);
                if(COMMON_FILE_NAMES.includes(file.name)) {
                    console.log("Found file: ", file);
                    ftp_potential_files.push({
                        path: path,
                        name: file.name,
                        loc: path + "/" + file.name
                    })
                }
            }
        } catch (err) {
            console.log("Error listing files: ", err);
        }
    }

    console.log("Potential files: ", ftp_potential_files);

    // Access database
    // TODO: Remove database

    // console.log("Accessing database...");
    // let db;
    // let collection;

    // try {
    //     db = client.db(DB_NAME);
    //     collection = db.collection(DB_COLLECTION);
    // } catch (err) {
    //     return res.status(500).json({ message: "Error connecting to database: " + err.toString()});
    // }

    // Version 4, Login via FTP

    // let query = { uuid: changes[0].uuid };
    // let result = await collection.findOne(query);
    // let element_selector = result.xpath;

    let test_selector = changes[0].xpath;

    let $;

    let file;

    // Add tmp folder if it doesn't exist
    try {
        if(!fs.existsSync("save/tmp")) {
            fs.mkdirSync("save/tmp");
        }
    } catch (err) {
        console.log("Error creating tmp folder: ", err);
    }

    console.log("Getting potential files via FTP...")
    for(let file_data of ftp_potential_files) {

        console.log("Getting file: ", file_data);

        try {
            await ftp.getFile(file_data.loc, file_data.name, ftp_username, ftp_password, ftp_host, ftp_port);
        } catch (err) {
            return res.status(500).json({ message: "Error getting file: " + err.toString()});
        }
            
        file = fs.readFileSync("save/tmp/" + file_data.name);

        try {
            $ = cheerio.load(file.toString());

            function findItemWithCSSPath(cssPath) {
                let all_elements = $('*');

                for(let element of all_elements) {
                    if(getCSSPath(element) === test_selector) {
                        return element;
                    }
                }
            }

            let item = findItemWithCSSPath(test_selector);

            if(item != undefined) {
                // TODO: Run element tests
                console.log("Found valid file: ", file_data);
                ftp_file_loc = file_data.loc;
                ftp_file_name = file_data.name;
                break;
            }
        } catch (err) {
            cleanTempFolder();
            console.log("Error loading file: ", err);
        }
    }

    // Iterate through the changes
    console.log("Iterating through changes...");

    try {
        $ = cheerio.load(file.toString());
        // console.log($.root().html())
        
        for(let i=0; i < changes.length; i++) {
            let change = changes[i];
            console.log("Change: ", change);
            // For each change, get the xpath from the db given the uuid

            // let query = { uuid: change.uuid };
            // let result = await collection.findOne(query);
            // console.log("Result: ", result);
            // let element_selector = result.xpath;

            let selector_str = change.xpath;

            function findItemWithCSSPath(cssPath) {
                let all_elements = $('*');

                for(let element of all_elements) {
                    if(getCSSPath(element) === selector_str) {
                        return element;
                    }
                }
            }

            let item = findItemWithCSSPath(selector_str);

            console.log('uuid: ', change.uuid);
            console.log('selector: ', selector_str);

            // Check inner html

            if($(item).html() != change.old_inner_html) {
                return res.status(400).json({ message: "Wrong element: " + " current html " + $(item).html() + " old html " + change.old_inner_html});
            }

            $(item).html(change.new_inner_html);
        }
    } catch (err) {
        cleanTempFolder();
        return res.status(500).json({ message: "Error updating element: " + err.toString()});
    }       

    // Save the file
    console.log("Saving file...");
    try {
        fs.writeFileSync("save/tmp/" + ftp_file_name, $.root().html());
    } catch (err) {
        cleanTempFolder();
        return res.status(500).json({ message: "Error writing file: " + err.toString()});
    }

    // Version 4, Upload the file via FTP
    console.log("Uploading file via FTP...")
    try {
        await ftp.uploadFile(ftp_file_loc, ftp_file_name, ftp_username, ftp_password, ftp_host, ftp_port);
    } catch (err) {
        cleanTempFolder();
        return res.status(400).json({ message: "Error uploading file: " + err.toString()});
    }

    // Clean tmp folder
    cleanTempFolder();

    console.log("Changes saved successfully");
    return res.status(200).json({ message: "Success" });
};

function cleanTempFolder() {
    // Clean tmp folder
    console.log("Cleaning tmp folder...");
    const directory = "save/tmp";

    fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
        fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
        });
    }
    });
}

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