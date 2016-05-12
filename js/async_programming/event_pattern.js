/* one to one */

var events = require('events');
var console = require('console');
var util = require('util');

function Producer() {

    events.EventEmitter.call(this);

    var totalCount = totalCount || 100;

    var currentCount = 0;
    this.produce = beans => {


        if (!util.isArray(beans)) {
            beans = [];
        }

        var i = 0;
        var bean;

        while (i < 18 && ++currentCount <= totalCount) {

            bean = Math.round(Math.random() * 100);

            beans.push(bean);

            console.log("produce: " + bean);

            i++;

        }

        console.log('current count: ' + currentCount);

        if(currentCount<=100){
        console.log("full listeners: " + this.listenerCount('full'));
        this.emit('full', beans);
        }


    };

};

Producer.prototype = new events.EventEmitter();
Producer.prototype.constructor = Producer;

//util.inherits(Producer, events.EventEmitter);

function Consumer(name) {

    events.EventEmitter.call(this);

    this.name = name;

    var consumer = this;

    this.consume = function(beans) {


        var i = 0;
        while (i < 10 && beans.length > 0) {
            var bean = beans.shift();
            console.log(name + "consume: " + bean);
            i++;

        }

        console.log("beans.length: " + beans.length);

        console.log(consumer.listenerCount('empty'));

        if (beans.length == 0) {
            var hasListeners = consumer.emit('empty', beans);
            console.log('Has listeners?: ' + hasListeners);
        }

    };


}

Consumer.prototype = new events.EventEmitter();
Consumer.prototype.constructor = Consumer;



function Mix(name, totalCount) {

    var totalCount = totalCount || 100;

    var currentCount = 0;

    events.EventEmitter.call(this);

    this.name = name;

    this.consume = function(beans) {

        if (!util.isArray(beans)) {
            beans = [];
        }

        while (beans.length > 5) {

            var bean = beans.shift();
            console.log(name + "consume: " + bean);

        }

        console.log("beans.length: " + beans.length);

        console.log(this.listenerCount('empty'));


        var hasListeners = this.emit('empty', beans);
        console.log('Has listeners?: ' + hasListeners);


    };

    this.produce = function(beans) {

        if (!util.isArray(beans)) {
            beans = [];
        }


        var bean;

        while (beans.length < 20 && currentCount++ <= totalCount) {


            bean = Math.round(Math.random() * 100);

            beans.push(bean);

            console.log(this.name + " produce: " + bean);

        }
        if (currentCount <= totalCount) {
            console.log("full listeners: " + this.listenerCount('full'));
            this.emit('full', beans);
        }


    };


}
Mix.prototype = new events.EventEmitter();
Mix.prototype.constructor = Mix;


exports.Producer = Producer;
exports.Consumer = Consumer;
exports.Mix = Mix;
