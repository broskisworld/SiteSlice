const fs = require('fs');
const cheerio = require('cheerio');

// INPUT
let file = fs.readFileSync('./output.html');
let file_contents = file.toString();
let $ = cheerio.load(file_contents);
console.log(`${file_contents.length} characters read from to index.html & parsed to cheerio`);
console.log(`${$.root().html().length} characters in cheerio root`);

// UTILS
function get_css_path(el) {
    let path = [], parent;
    while (parent = el.parent) {
        path.unshift(`${el.tagName}:nth-child(${parent.children.filter((node) => node.type == 'tag').indexOf(el) + 1})`);
        el = parent;
    }
    return `${path.join(' > ')}`.toLowerCase();
}

function update_element_in_html_by_css_query(css_query,html, new_inner_html) {
}

// PROCESSING
let footer_col_1 = $('#bottom1')[0];
let footer_col_1_css_path = get_css_path(footer_col_1);
console.log(`footer_col_1: ${footer_col_1_css_path}`);
let found_el = $(footer_col_1_css_path);
console.log(`found_el: ${found_el.length}`);
console.log(`Processing complete!`);

// OUTPUT
let output = $.root().html();
fs.writeFileSync('./output2.html', output);
console.log(`${output.length} characters written to output2.html`);
