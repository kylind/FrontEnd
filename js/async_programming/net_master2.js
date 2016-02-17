var cp=require('child_process');
var net=require('net');
var os=require('os');


var server=net.createServer();
server.listen(1237,function(){
    var cpus=os.cpus();
    for(var i=0;i<cpus.length;i++){
        createWorker();
    }
});

process.on('exit',function(){
    for(var pid in workers){
        console.log('master will kill child process: ' + pid);
        workers[pid].kill();
    }

})


var workers={};

function createWorker(){
    var worker=cp.fork('net_http.js');
    worker.on('exit',function(){
        console.log('create new worker when i exit soon!');
        delete workers[worker.pid];
        createWorker();
    })
    workers[worker.pid]=worker;
    worker.send(worker.pid, server);

}





console.log('main process: ' + process.pid);