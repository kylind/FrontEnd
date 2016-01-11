/* one to one */

var events = require('events');
var console = require('console');
var util=require('util');

function Producer() {

    events.EventEmitter.call(this);


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

        this.emit('full', beans);

    };

};

Producer.prototype = new events.EventEmitter();
Producer.prototype.constructor = Producer;



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

        console.log("beans.length" + beans.length);

        if(beans.length==0){
            this.emit('empty', beans);
        }



    };

}

Consumer.prototype=new events.EventEmitter();
Consumer.prototype.constructor=Consumer;



exports.Producer = Producer;
exports.Consumer = Consumer;
