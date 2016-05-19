    var co = require('co');

    function SimpleKoa() {
        this.middlewares = [];
    }
    SimpleKoa.prototype = {
        //注入个中间件
        use: function(gf) {
            this.middlewares.push(gf);
        },
        //执行中间件
        listen: function() {
            this._run();
            //this.mockRun();
            console.log("run end" + this.body);

        },
        _run: function() {
            console.log("run start");
            var ctx = this;
            var middlewares = ctx.middlewares;
            return co(function*() {
                var prev = null;
                var i = middlewares.length;
                //从最后一个中间件到第一个中间件的顺序开始遍历
                while (i--) {
                    //实际Koa的ctx应该指向server的上下文，这里做了简化
                    //prev 将前面一个中间件传递给当前中间件
                    prev = middlewares[i].call(ctx, prev);
                    /*console.dir(prev.next, { 'showHidden': true });*/
                    console.log(prev.next);
                }
                //执行第一个中间件


                yield prev;
                console.log('xxx' + ctx.body);
            });
        },
        mockRun: function(){
            var ctx = this;
            var middlewares = ctx.middlewares;
            var async = function*() {
                var prev = null;
                var i = middlewares.length;
                while (i--) {
                    prev = middlewares[i].call(ctx, prev);
                }



                yield prev;
                console.log('xxx' + ctx.body);
            };

           /* var gen = async();

            var gen1 = gen.next().value;

            var gen2 = gen1.next().value;

            var gen3 = gen2.next().value;

            gen3.next();

            gen2.next();
            gen1.next();

            gen.next();*/

            function myRun(async){
                var gen = async();

                var isDone=false;

                var middle = [];

                while(!isDone){

                    middle.push(gen);

                    var res = gen.next();

                    gen = res.value;

                    isDone = res.done;

                }

                middle.forEach(function(item){

                    item.next();


                })


            }

            myRun(async);

        }
    };



    var app = new SimpleKoa();
    app.use(function*(next) {

        this.body = '1';
        console.log("step 1 start" + this.body);
        yield next;
        this.body += '5';
        console.log("step 1 end" + this.body);

    });
    app.use(function*(next) {

        this.body += '2';
        console.log("step 2 start" + this.body);
        yield next;
        this.body += '4';
        console.log("step 2 end" + this.body);
    });
    app.use(function*(next) {
        this.body += '3';
        console.log("step 3 " + this.body);
    });
    app.listen();
