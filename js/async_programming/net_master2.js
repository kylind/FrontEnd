var cp=require('child_process');
var net=require('net');
var os=require('os');


var server=net.createServer();
server.listen(1238,function(){
    var cpus=os.cpus();
    for(var i=0;i<cpus.length;i++){
        createWorker();
    }
});

process.on('exit',function(){
    for(var pid in workers){
        console.log('Master will kill child process: ' + pid);
        workers[pid].kill();
    }

})


var workers={};

function createWorker(){
    var worker=cp.fork('net_http.js');
    worker.on('exit',function(){
        delete workers[worker.pid];
        console.log('I thought you have started new worker, I am quiting');
    })

    worker.on('message', (msg) =>{
        if(msg.act == 'suicide'){
            console.log('create new worker since one of workers will exit soon!');
            createWorker();
        }

    });
    workers[worker.pid]=worker;
    worker.send(worker.pid, server);

}


console.log('main process: ' + process.pid);