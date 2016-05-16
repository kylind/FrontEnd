var Router = require('koa-router');



router = new Router();
router.get('/orders', function*(next) {

    var product = [{
        name: 'a',
        price: 11
    }, {
        name: 'b',
        price: 2
    }, {
        name: 'c',
        price: 3
    }];
    yield this.render('content', {
        product: product
    });

});

router.post('/dbrestaurant', function*(next) {

    dbOperations.add();
    yield next;

});


exports.router = router;
exports.dbOperations = dbOperations;
