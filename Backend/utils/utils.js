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
