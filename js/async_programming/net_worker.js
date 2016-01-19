
process.on('message', function(msg, server) {

    server.on('connection', function(socket) {
        console.log('child connected...');
        socket.end(msg + ': Handled by child!');
    });


});

console.log('child process launched!');
