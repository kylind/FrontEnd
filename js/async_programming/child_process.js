var cp=require('child_process');
var readline = require('readline');

var child=cp.fork("./child_worker.js");

child.send('RealMaster');
child.on('message',function(msg){

    console.log('rs from worker: ' + msg);

});

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("What do you think of Node.js? ", function(answer) {
   child.send(answer);

});