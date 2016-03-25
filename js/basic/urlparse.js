var http = require('http');
var querystring = require('querystring');
var url = require('url');

var console = require('console');
var server = http.createServer(function(req, res) {

    var parsedUrl = url.parse(req.url);

    var needBreak = querystring.parse(parsedUrl.query);

    if (needBreak && needBreak.error== "1") {
        throw new Error('intentional error');

    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hanled by child process which id is : ' + process.pid);

    }


}).listen(1234);