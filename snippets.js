input_url = 'https://google.com/test?test=1&test2=2';

const url_regex = /()()((https?):)?(\/?\/?)([-a-zA-Z0-9@:%._\+~#=]{1,256})([-a-zA-Z0-9@:%._\+~#=\/]{1,256})(\??)([\w-]+(=[\w-]*)?(&[\w-]+(=[\w-]*)?)*)?/g;
/* Explanation
1st capturing group is unused
2nd capturing group is unused
3rd capturing group is protocol & :
4th capturing group is http, https, or nothing
5th capturing group is //, /, or nothing
    If "//", relative protocol. hostname MUST be included
    If "/", relative path. hostname MUST NOT be included
    If "", relative or absolute path. hostname MAY or MAY NOT be included
6th capturing group is hostname (or first part of relative path) -- may not have slashes
7th capturing group is rest of path -- can have slashes
8th capturing group is ? -- if present, there are query params
9th capturing group is anything else after the ? -- query params
*/

let matched_link = url_regex.exec(input_url)
let link_data = {
    protocol_plus_colon: matched_link[3] || '',
    protocol: matched_link[4] || '',
    slashes: matched_link[5] || '',
    hostname_or_path: matched_link[6] || '',
    rest_of_path: matched_link[7] || '/',
    query_param_separator: matched_link[8] || '',
    query_params: matched_link[9] || '',
    quotation_mark_2: matched_link[13] || '',
    full_match_link_and_attr: matched_link[0],
    starting_index: matched_link.index,
    ending_index: matched_link.index + matched_link[0].length,
    full_match_length: matched_link[0].length
};

// Assumptions: the URL provided will always be an absolute URL
let host = link_data.protocol_plus_colon + link_data.slashes + link_data.hostname_or_path;
let path_and_query = link_data.rest_of_path + link_data.query_param_separator + link_data.query_params + (link_data.query_param_separator ? '&' : '?') + 'proxy_url=' + host;
let iframe_src = `http://localhost:5600${path_and_query}`;

console.log('host: ', host);
console.log('iframe_src: ', iframe_src);

//if i have alink https://google.com/test, i need to separate