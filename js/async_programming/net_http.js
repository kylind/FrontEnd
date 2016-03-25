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


});

process.on('message', function(msg, tcp) {

    console.log('Child process receive the message: ' + msg);

    tcp.on('connection', function(socket) {

        server.emit('connection', socket);

    })

});

process.on('exit', function() {
    console.log(process.pid + ' will quit...');
});

process.on('uncaughtException', function() {

    console.log('OOPS, i come across the trouble');

    process.send({ act: 'suicide' });

    server.close(function() {
        process.exit(1);
    })

    setTimeout(function(){
        process.exit(1);
    }, 5000);

});
