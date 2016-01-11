var Express = require('express');
var event_pattern = require('./event_pattern');
var readline=require('readline');

var util = require('util');

var producer = new event_pattern.Producer();
var consumer1 = new event_pattern.Consumer('A');
var consumer2 = new event_pattern.Consumer('B');

producer.on('full', consumer1.consume);
producer.on('full', consumer2.consume);

consumer1.on('empty', producer.produce);
console.log(consumer1.listenerCount('empty'));

consumer2.on('empty', producer.produce);
console.log(consumer2.listenerCount('empty'));
producer.produce();


/*var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("What do you think of Node.js? ", function(answer) {
  // TODO: Log the answer in a database
  console.log("Thank you for your valuable feedback:", answer);

  rl.close();
});
*/


/*var express = new Express();
express.get('/', function(request, response) {
    response.send('hello world');

});
express.listen(3001, function() {
    console.log('listen start...');
});*/