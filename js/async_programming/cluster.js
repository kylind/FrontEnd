var cluster = require('cluster');
var http = require('http');

var os=require('os');

if(cluster.isMaster){

    for(var i=0;i< os.cpus().length;i++){
        cluster.fork();
    }

    cluster.on('exit',function(worker,code, signal){

        console.log(" Worker: " + worker)

    });

}else{

    http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
    }).listen(8000);

}
