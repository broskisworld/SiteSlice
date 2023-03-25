const client = require('ftp');

const getFile = async (filePath, fileName, username, password, host, port) => {
    const c = new client();
    c.on('ready', function() {
        console.log('Connected to FTP server');
        c.get(filePath, function(err, stream) {
            if (err) throw err;
            stream.once('close', function() { c.end(); });
            stream.pipe("tmp/" + fileName);
        });
    });

    c.connect({
        host: host,
        port: port,
        user: username,
        password: password
    });

    return "tmp/" + fileName;
};

const uploadFile = async (filePath, fileName, username, password, host, port) => {
    const c = new client();
    c.on('ready', function() {
        console.log('Connected to FTP server');
        c.put('tmp/'+fileName, filePath, function(err) {
            if (err) throw err;
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
    uploadFile
};