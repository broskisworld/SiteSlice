const client = require('ftp');

var c = new client();
c.on('ready', function() {
    console.log('Connected to FTP server');
});

c.connect({
    host: 'localhost',
    port: 5678,
    user: 'anonymous',
    password: 'anonymous'
});