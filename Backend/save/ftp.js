const client = require('ftp');
const fs = require('fs');

const getFile = (filePath, fileName, username, password, host, port, callback) => {
    var c = new client();
    c.on('ready', function() {
      c.get(filePath, function(err, stream) {
        if (err) throw err;
        stream.once('close', function() { c.end(); 
            callback();});
        stream.pipe(fs.createWriteStream('save/tmp/'+fileName));
      });
    });

    c.connect({
        host: host,
        port: port,
        user: username,
        password: password
    });
};

const uploadFile = async (filePath, fileName, username, password, host, port, callback) => {
    const c = new client();
    c.on('ready', function() {
        c.put("save/tmp/" + fileName, filePath, function(err) {
            if (err) {
                console.log(err);
                throw err;
            }
            c.end();
            callback();
        });
    });

    c.connect({
        host: host,
        port: port,
        user: username,
        password: password
    });
}

const listFiles = async (filePath, username, password, host, port) => {
    const c = new client();
    c.on('ready', function() {
        c.list(filePath, function(err, list) {
            if (err) throw err;
            console.dir(list);
            c.end();
        });
    });

    c.connect({
        host: host,
        port: port,
        user: username,
        password: password
    });
}

module.exports = {
    getFile,
    uploadFile,
    listFiles
};