var cp=require('child_process');
var net=require('net');

var child1=cp.fork('net_worker.js');
var child2=cp.fork('net_worker.js');
var server=net.createServer();

server.on('connection',function(socket){
    console.log('server connected...')
    socket.end('Handled by parent!');
});

server.listen(1234,function(){
    console.log('server listened...')
    child1.send('pass to child1: ', server);
    child2.send('pass to child2: ', server);

    server.close();
});