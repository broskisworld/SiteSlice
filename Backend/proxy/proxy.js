const axios = require('axios');
const axiosRetry = require('axios-retry');
const xpath = require('xpath');
const cheerio = require('cheerio');
const client = require('../db/db').client;
const uuid = require('uuid').v4;
const { DOMParser, XMLSerializer} = require('xmldom');

const CONFIG = require('../../config');

const MONGO_DB = 'SiteSliceDB';
const MONGO_COLLECTION = 'elements';
const DEBUG_MODE = false;

const proxy = (async (req, res) => {
    let proxy_url = req.vhost.hostname.slice(0, req.vhost.hostname.lastIndexOf(CONFIG.PROXY_HOSTNAME));

    if(proxy_url === '') {
        return res.status(404).send('No proxy domain specified');
    }

    // trim tailing '.'
    proxy_url = proxy_url.slice(0, -1);

    let parsed_url_test = '';

    console.log(`proxy_url=${proxy_url}`)
    console.log(`req.originalUrl=${req.originalUrl}`)

    try {
        let site_slice_header = 'SiteSlice Proxy';

        let full_resource_path = `${proxy_url}${req.originalUrl}`;
        
        let slashes = '//';
        if(!full_resource_path.startsWith('http')) {

            if(full_resource_path[0] == '/') {
                if(full_resource_path[1] == '/') {
                    slashes = '';
                } else {
                    slashes = '/';
                }
            }
            console.log('does not start with http!')
            full_resource_path = 'http:' + slashes + full_resource_path;
        }
        
        let full_resource_path_sanitized = full_resource_path;
        console.log(`full resource path sanitized: ${full_resource_path_sanitized}`)

        // get the actual url data
        parsed_url_test = full_resource_path_sanitized;

        if(parsed_url_test == 'http://siteslicetest.rainroomcreative.com/siteslicetest.rainroomcreative.com.proxy.iwontexplainit.com') {
            console.log('BAD!')
            console.log(`a: ${proxy_url}${req.url}`)
            console.log(`b: ${slashes}`);
            console.log(`c: ${full_resource_path}`)
            console.log(`d: ${full_resource_path_sanitized}`)
        }

        let original_url_response = await axios.get(full_resource_path_sanitized);
        let original_html =  original_url_response.data;
        console.log('got original data from ' + full_resource_path_sanitized);

        // console.log(`headers are:\n${original_url_response.headers['content-type']}`);

        res.setHeader('content-type', original_url_response.headers['content-type'].split(';')[0]);

        if(original_url_response.headers['content-type'].includes('text/html')) {
            // Replace links before doing any processing
            const url_attr_regex = /(src|href)=(\"|\')((https?):)?(\/?\/?)([-a-zA-Z0-9@:%._\+~#=]{1,256})([-a-zA-Z0-9@:%._\+~#=\/]{0,256})(\??)([\w-]+(=[\w-]*)?(&[\w-]+(=[\w-]*)?)*)?(\"|\')/g;
            // TODO: [V6+] support srcset, bgset
            // There is a weird edge case where there are no protocol slashes, but the site host starts with http or https and that's captured

            let matched_links = [];
            let matched_link = [];

            let remaining_html = original_html;
            let good_html = '';

            while ((matched_link = url_attr_regex.exec(remaining_html)) !== null) {
                let attr_debug_msg = '';

                let attr_data = {
                    attr_name: matched_link[1] || '',
                    quotation_mark_1: matched_link[2] || '',
                    protocol_plus_colon: matched_link[3] || '',
                    protocol: matched_link[4] || '',
                    slashes: matched_link[5] || '',
                    hostname_or_path: matched_link[6] || '',
                    rest_of_path: matched_link[7] || '',
                    query_param_separator: matched_link[8] || '',
                    query_params: matched_link[9] || '',
                    quotation_mark_2: matched_link[13] || '',
                    full_match_link_and_attr: matched_link[0] || '',
                    starting_index: matched_link.index,
                    ending_index: matched_link.index + matched_link[0].length,
                    full_match_length: matched_link[0].length
                }

                matched_links.push(attr_data);

                // console.log(`found changes: ${attr_data.full_match_link_and_attr}, has query params? ${attr_data.query_params.length > 0}`);

                // console.log(JSON.stringify(attr_data, null, 4))

                // PROXY_URL_QUERY
                // let attr_replacement = `${attr_data.attr_name}=${attr_data.quotation_mark_1}${attr_data.protocol_plus_colon}${attr_data.slashes}${attr_data.hostname_or_path}${attr_data.rest_of_path}${attr_data.query_param_separator}${attr_data.query_params}${attr_data.query_params.length > 0 ? '&' : '?'}proxy_url=${proxy_url}${attr_data.quotation_mark_2}`;

                let hostname_or_path_with_protocol_capture = attr_data.protocol_plus_colon + attr_data.slashes + attr_data.hostname_or_path;    // Everything up to the first slash
                let attr_original_url = hostname_or_path_with_protocol_capture + attr_data.rest_of_path + attr_data.query_param_separator + attr_data.query_params;   // The link w/o attr stuff
                let attr_new_url = attr_original_url;

                if(attr_data.slashes == '//') {
                    // Absolute path with protocol slashes -- must include hostname
                    attr_new_url = `${attr_data.hostname_or_path_with_protocol_capture}.${CONFIG.PROXY_HOSTNAME}${attr_data.rest_of_path}${attr_data.query_param_separator}${attr_data.query_params}`;
                } else if(attr_data.slashes == '/') {
                    // Relative path from hostname -- Hostname does not need to be included
                    attr_new_url = `${attr_data.hostname_or_path_with_protocol_capture}${attr_data.rest_of_path}${attr_data.query_param_separator}${attr_data.query_params}`;
                } else if(attr_data.slashes == '') {
                    // Relative path -- hostname does not need to be included unless first part of the string is hostname
                    // change in way it works: making assumptions that it is actually an absolute path because it has a . in the first part of the string doesnt work for href="index.html"
                    if(attr_data.hostname_or_path == proxy_url /*| attr_data.hostname_or_path.includes('.')*/) {
                        attr_new_url = `${proxy_url}.${CONFIG.PROXY_HOSTNAME}` + `${hostname_or_path_with_protocol_capture}${attr_data.rest_of_path}${attr_data.query_param_separator}${attr_data.query_params}`.slice(proxy_url.length)
                    } else {
                        attr_new_url = attr_original_url;
                    }
                }

                let attr_replacement = `${attr_data.attr_name}=${attr_data.quotation_mark_1}${attr_new_url}${attr_data.quotation_mark_2}`;

                let before_link = remaining_html.slice(0, attr_data.starting_index);
                let after_link = remaining_html.slice(attr_data.ending_index);

                good_html += before_link;
                good_html += attr_replacement;
                remaining_html = after_link;

                url_attr_regex.lastIndex = 0; // since we're eating stuff from the string, we need to reset the regex
            }

            // good_html = original_html;

            
            // UUID <-> Unique CSS selector for each element
            let $ = cheerio.load(good_html);

            let all_elements = $('*');

            // create unique xpaths for each element
            let list_of_uuid_refs = [];
            for(let element of all_elements) {
                let el_uuid = uuid();
                let el_xpath = getCSSPath(element);
                $(element).attr('uuid', el_uuid);
                $(element).attr('xpath', el_xpath);
                // TODO: [V4+] store old innnerHTML in the DB

                const element_ref_doc = {
                    url: full_resource_path_sanitized,
                    uuid: el_uuid,
                    xpath: el_xpath,
                    inner_html: 'NOT IMPLEMENTED'
                };

                list_of_uuid_refs.push(element_ref_doc);

                // console.log(Object.keys(element));
            }

            elements_db = await client.db(MONGO_DB);
            elements_collection = await elements_db.collection(MONGO_COLLECTION);

            // add to DB
            console.log(`about to add ${list_of_uuid_refs.length} elements to the DB!`);
            const options = { ordered: true }; // this option prevents additional documents from being inserted if one fails
            // console.log(JSON.stringify(list_of_uuid_refs))
            const add_refs_to_db_result = await elements_collection.insertMany(list_of_uuid_refs);

            console.log(`Added ${add_refs_to_db_result} elements to the DB!`);
            
            // Add Injectables.js
            $('head').append('<script src="http://localhost:8080/src/injectables/injectables.js"></script>')
            
            // Export cheerio doc
            let doc_output_str = $.root().html();

            let headers_set_ct = 0;
            for(let header of original_url_response.headers) {
                // console.log(`setting header ${header[0]} to ${header[1]}`)
                res.setHeader(header[0], header[1]);

                headers_set_ct++;
            }
            console.log(`set ${headers_set_ct} headers to match proxied request`);

            let site_header_bar = `<div style="background:#fdba74;">${site_slice_header}</div></br>`;
            res.status(200).send(`${DEBUG_MODE ? site_header_bar : ''}${doc_output_str}`);

            // Done!
            console.log(`Done proxying ${full_resource_path_sanitized}!`);
        } else {
            /* Non HTML file !!! */

            console.log('Non html file, returning original response w/o additional preprocessing!');
            console.log(`total bytes: ${original_url_response.data.length / 1000}kb}`)

            try {
                axiosRetry(axios, {
                    retries: 3,
                    retryDelay: axiosRetry.exponentialDelay
                });
                let get_non_html_file = axios({
                    method: 'get',
                    url: full_resource_path_sanitized,
                    responseType: 'stream'
                }).then((axios_response) => {
                    axios_response.data.pipe(res);
                });
            } catch (error) {
                console.log('Error in non-html file proxying!')
                console.dir(error)
                console.log(`
 _____ _______ ____  _____  _ 
 / ____|__   __/ __ \|  __ \| |
| (___    | | | |  | | |__) | |
 \___ \   | | | |  | |  ___/| |
 ____) |  | | | |__| | |    |_|
|_____/   |_|  \____/|_|    (_)
`);
                console.log('TELL JOSH YOU SAW THIS AND DONT REFRESH --> Josh saw this error but couldnt replicate. I want to figure out if retrying the stream is better than swapping from stream');
            }
        }        
    } catch (error) {
        res.status(500).send(`[${parsed_url_test}] Error from SiteSlice: ${error}`);
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

function removeURLParameter(url, parameter) {
    //prefer to use l.search if you have a location/link object
    var urlparts = url.split('?');   
    if (urlparts.length >= 2) {

        var prefix = encodeURIComponent(parameter) + '=';
        var pars = urlparts[1].split(/[&;]/g);

        //reverse iteration as may be destructive
        for (var i = pars.length; i-- > 0;) {    
            //idiom for string.startsWith
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
                pars.splice(i, 1);
            }
        }

        return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
    }
    return url;
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
    proxy
}