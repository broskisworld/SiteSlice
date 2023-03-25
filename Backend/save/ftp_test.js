const ftp = require('./ftp.js');
const dotenv = require('dotenv').config();

ftp.listFiles('/', process.env.FTP_USERNAME, process.env.FTP_PASSWORD, process.env.FTP_HOST, process.env.FTP_PORT);

ftp.uploadFile('/public_html/test.txt', 'test.txt', process.env.FTP_USERNAME, process.env.FTP_PASSWORD, process.env.FTP_HOST, process.env.FTP_PORT);

ftp.getFile('/public_html/test.txt', 'test.txt', process.env.FTP_USERNAME, process.env.FTP_PASSWORD, process.env.FTP_HOST, process.env.FTP_PORT);