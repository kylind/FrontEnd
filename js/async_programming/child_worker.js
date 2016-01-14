function worker(){
    console.log('i am worker!');

    var rs=Math.round(Math.random()*100);

    process.send('NoMasterCommand: ' + rs);


    process.on('message',function(masterCommand){

         process.send(masterCommand + ": " + rs);

    })
}

worker();