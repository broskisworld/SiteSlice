const axios = require('axios');
const xpath = require('xpath');
const client = require('../db/db').client;
const uuid = require('uuid').v4;
const { DOMParser, XMLSerializer} = require('xmldom');

const MONGO_DB = 'SiteSliceDB';
const MONGO_COLLECTION = 'elements';


const proxy = (async (req, res) => {
    try {
        let site_slice_header = 'SiteSlice Proxy';

        elements_db = await client.db(MONGO_DB);
        elements_collection = await elements_db.collection(MONGO_COLLECTION);

        // Parse the url
        let url = String(req.url).slice(1);
        if(!url.startsWith('http')) {
            url = 'http://' + url;
        }

        // Download url files
        let original_url_response = await axios.get(url);
        let original_html = original_url_response.data;

        // Initial analysis of file
        let doc = new DOMParser().parseFromString(original_html);

        // UUID elements
        let all_elements = xpath.select("//*", doc);
        site_slice_header += ` | ${all_elements.length} elements`;

        // create unique xpaths for each element
        let list_of_uuid_refs = [];
        for(let element of all_elements) {
            let el_uuid = uuid();
            let el_xpath = createXPathFromElement(element, all_elements);
            element.setAttribute('uuid', el_uuid);
            element.setAttribute('xpath', el_xpath);
            // TODO: [V4+] store old innnerHTML in the DB

            const element_ref_doc = {
                url: url,
                uuid: el_uuid,
                xpath: el_xpath,
                inner_html: 'NOT IMPLEMENTED'
            };

            list_of_uuid_refs.push(element_ref_doc);

            // console.log(Object.keys(element));
        }

        // add to DB
        console.log(`about to add ${list_of_uuid_refs.length} elements to the DB!`);
        const options = { ordered: true }; // this option prevents additional documents from being inserted if one fails
        console.log(list_of_uuid_refs[0])
        const add_refs_to_db_result = await elements_collection.insertMany(list_of_uuid_refs);

        console.log(`Added ${add_refs_to_db_result} elements to the DB!`)

        // Proxy links
        // let links = xpath.select("//a/@href", doc);

        // Add Injectables.js

        // Re-export
        
        res.status(200).send(`<div style="background:#fdba74;">${site_slice_header}</div></br>${doc_output_str}`);

        // Done!
        console.log(`Done proxying ${url}!`);
    } catch (error) {
        res.status(500).send('Error from SiteSlice:' + error);
    }
});

/* ANCHOR Utils */

/*
Thank you stijn de ryck & BoltClock
https://stackoverflow.com/a/5178132
*/
function createXPathFromElement(elm, all_elements) { 
    var allNodes = all_elements;
    for (var segs = []; elm && elm.nodeType == 1; elm = elm.parentNode) 
    { 
        if (elm.hasAttribute('id')) { 
                var uniqueIdCount = 0; 
                for (var n=0;n < allNodes.length;n++) { 
                    if (allNodes[n].hasAttribute('id') && allNodes[n].id == elm.id) uniqueIdCount++; 
                    if (uniqueIdCount > 1) break; 
                }; 
                if ( uniqueIdCount == 1) { 
                    segs.unshift('id("' + elm.getAttribute('id') + '")'); 
                    return segs.join('/'); 
                } else { 
                    segs.unshift(elm.localName.toLowerCase() + '[@id="' + elm.getAttribute('id') + '"]'); 
                } 
        } else if (elm.hasAttribute('class')) { 
            segs.unshift(elm.localName.toLowerCase() + '[@class="' + elm.getAttribute('class') + '"]'); 
        } else { 
            for (i = 1, sib = elm.previousSibling; sib; sib = sib.previousSibling) { 
                if (sib.localName == elm.localName)  i++; }; 
                segs.unshift(elm.localName.toLowerCase() + '[' + i + ']'); 
        }; 
    }; 
    return segs.length ? '/' + segs.join('/') : null; 
}; 

function lookupElementByXPath(path) { 
    var evaluator = new XPathEvaluator(); 
    var result = evaluator.evaluate(path, document.documentElement, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null); 
    return  result.singleNodeValue; 
} 

module.exports = {
    proxy
}