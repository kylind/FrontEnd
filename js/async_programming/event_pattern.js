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

        while (i < 20) {

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



function Consumer() {

    events.EventEmitter.call(this);

    this.consume = function(beans) {

        var i = beans.length;

        while (i > 5) {
            var bean = beans.shift();
            console.log("consume: " + bean);
            i--;
        }

        this.emit('empty', beans);

    };

}

Consumer.prototype=new events.EventEmitter();
Consumer.prototype.constructor=Consumer;



exports.Producer = Producer;
exports.Consumer = Consumer;
