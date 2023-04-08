const save_api_call = async (url, ftp_username, ftp_password, changes_dict) => {
    let values = Object.keys(changes_dict).map(function(key){
        return dictionary[key];
    });
    
    const body = {
        url: url,
        ftp_username: ftp_username,
        ftp_password: ftp_password,
        changes: values
    }

    let response = await fetch('http://localhost:5500/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    return await response.json();
}

function preg_quote (str, delimiter) {
    // Quote regular expression characters plus an optional character  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/preg_quote    // +   original by: booeyOH
    // +   improved by: Ates Goral (http://magnetiq.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: Brett Zamir (http://brett-zamir.me)    // *     example 1: preg_quote("$40");
    // *     returns 1: '\$40'
    // *     example 2: preg_quote("*RRRING* Hello?");
    // *     returns 2: '\*RRRING\* Hello\?'
    // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");    // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'
    return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
}

module.exports = {
    save_api_call,
    preg_quote
}