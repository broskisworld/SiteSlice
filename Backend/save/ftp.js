const client = require('ftp');
const fs = require('fs');

const getFile = (filePath, fileName, username, password, host, port) => {
    return new Promise((resolve, reject) => {
        var c = new client();
        c.on('ready', function() {
        c.get(filePath, function(err, stream) {
            if (err) { reject(err) }
            else {
                stream.once('close', function() { 
                    c.end(); 
                    resolve();
                });
                stream.pipe(fs.createWriteStream('save/tmp/'+fileName));
            }            
            });
        });

        c.connect({
            host: host,
            port: port,
            user: username,
            password: password
        });
    });
};

const uploadFile = (filePath, fileName, username, password, host, port, callback) => {
    return new Promise((resolve, reject) => {
        const c = new client();
        c.on('ready', function() {
            c.put("save/tmp/" + fileName, filePath, function(err) {
                if (err) return reject(err);
                c.end();
                resolve();
            });
        });
    
        c.connect({
            host: host,
            port: port,
            user: username,
            password: password
        });
    });
}

const listFiles = (filePath, username, password, host, port, callback) => {
    return new Promise((resolve, reject) => {
        const c = new client();
        c.on('ready', function() {
            c.list(filePath, function(err, list) {
                if (err) return reject(err);
                c.end();
                resolve(list);
            });
        });

        c.connect({
            host: host,
            port: port,
            user: username,
            password: password
        });
    });
}

module.exports = {
    getFile,
    uploadFile,
    listFiles
};