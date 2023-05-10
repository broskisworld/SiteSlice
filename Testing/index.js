const fs = require('fs');
const cheerio = require('cheerio');

function get_css_path(el) {
    let path = [], parent;
    while (parent = el.parentNode) {
        path.unshift(`${el.tagName}:nth(${[].indexOf.call(parent.children, el)+1})`);
        el = parent;
    }
    return `${path.join(' > ')}`.toLowerCase();
}

function update_element_in_html_by_css_query(css_query,html, new_inner_html) {
}

// INPUT
let file = fs.readFileSync('../Frontend/Testbench/Lundahl-backup/homedir/public_html/index.html');
let file_contents = file.toString();
let $ = cheerio.load(file_contents);

// PROCESSING

// OUTPUT
let output = $.root().html();
fs.writeFileSync('./output.html', output);
