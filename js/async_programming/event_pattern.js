/* one to one */

var events = require('events');
var console = require('console');
var util=require('util');

function Producer(count) {

    events.EventEmitter.call(this);

    this.count= count|| 5;


    this.produce = function(beans) {

        if (!util.isArray(beans)){
            beans=[];
        }

        var i = 0;
        var bean;

        while (i < 18) {

            bean = Math.round(Math.random() * 100);

            beans.push(bean);

            console.log("produce: " + bean);

            i++;

        }
        console.log("full listeners: " + this.listenerCount('full'));
        this.emit('full', beans);

    };

};

/*Producer.prototype = new events.EventEmitter();
Producer.prototype.constructor = Producer;*/

util.inherits(Producer, events.EventEmitter);

function Consumer(name) {

    events.EventEmitter.call(this);

    this.name=name;

    this.consume = function(beans) {

        var i =  0;

        while (i<10 && beans.length>0) {
            var bean = beans.shift();
            console.log(name + "consume: " + bean);
            i++;
        }

        console.log("beans.length: " + beans.length);

        console.log(this.listenerCount('empty'));

        if(beans.length==0){
            var hasListeners=this.emit('empty', beans);
            console.log('Has listeners?: ' + hasListeners);
        }

    };

}

/*Consumer.prototype=new events.EventEmitter();
Consumer.prototype.constructor=Consumer;*/
util.inherits(Consumer, events.EventEmitter);


function Mix(name){

    events.EventEmitter.call(this);

    this.name=name;

    this.consume = function(beans) {

        while (beans.length > 5) {

            var bean = beans.shift();
            console.log(name + "consume: " + bean);

        }

        console.log("beans.length: " + beans.length);

        console.log(this.listenerCount('empty'));


        var hasListeners=this.emit('empty', beans);
        console.log('Has listeners?: ' + hasListeners);


    };

    this.produce = function(beans) {

        if (!util.isArray(beans)){
            beans=[];
        }


        var bean;

        while (beans.length < 20) {

            bean = Math.round(Math.random() * 100);

            beans.push(bean);

            console.log(this.name + " produce: " + bean);

        }
        console.log("full listeners: " + this.listenerCount('full'));
        this.emit('full', beans);

    };


}
util.inherits(Mix, events.EventEmitter);


exports.Producer = Producer;
exports.Consumer = Consumer;
exports.Mix = Mix;