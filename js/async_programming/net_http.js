var http=require('http');

var server=http.createServer(function(req,res){
    res.writeHead(200,{'Content-Type': 'text/plain'});
    res.end('Hanled by child process which id is : ' + process.pid);
});

process.on('message', function(msg, tcp){

    console.log('child process receive the message: ' + msg);

    tcp.on('connection',function(socket){

        server.emit('connection',socket);

    })

});