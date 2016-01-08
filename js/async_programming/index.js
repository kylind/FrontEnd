var event_pattern = require('./event_pattern');

var util=require('util');

var producer = new event_pattern.Producer();
var consumer = new event_pattern.Consumer();

producer.on('full', consumer.consume);
consumer.on('empty',producer.produce);

producer.produce();



