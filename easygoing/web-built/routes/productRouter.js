var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;

var util = require('./util.js').util;

var ProductCollection = require('../data_access/product.js').Collection

var OrderCollection = require('../data_access/order.js').Collection

var router = new Router();

var orderOperation, productOperation;

var dateFormatting = {
    month: "2-digit",
    day: "2-digit",
    weekday: "short"
};


router.use(function*(next) {

    if (this.isAuthenticated()) {
        productOperation = new ProductCollection(this.req.user.productCollection);
        orderOperation = new OrderCollection(this.req.user.collection, this.req.user.productCollection);
    }

    yield next

})

router.post('/products', function*() {

    var req = this.request.body;

    var products = req.products;

    if (Array.isArray(products) && products.length > 0) {

        for (var i = 0; i < products.length; i++) {

            util.processProduct(products[i]);
        }

        yield productOperation.save(products);

        products.forEach(function(product) {

            product.displayDate = product.modifiedDate ?  new Date(product.modifiedDate).toLocaleDateString("en-US", dateFormatting) : '';
        })

    }

    this.body = products;
    this.status = 200;

});

router.get('/products', function*() {

    var res = yield orderOperation.queryActiveProducts();

    res.forEach(function(product) {

        product.displayDate = product.modifiedDate ? new Date(product.modifiedDate).toLocaleDateString("en-US", dateFormatting) : '';

    });

    var model = {
        name: 'products',
        css: '',
        header: '',
        footer: '',
        products: res && res.length > 0 ? res : [],
        needMask: false
    }

    yield this.render('products', model);
});



router.get('/productsJson', function*() {

    var res = yield orderOperation.queryActiveProducts();

    res.forEach(function(product) {

        product.displayDate = product.modifiedDate ? new Date(product.modifiedDate).toLocaleDateString("en-US", dateFormatting) : '';

    });

    this.body = res;
    this.status = 200;

});

router.get('/activeClientsByProduct', function*() {

    var req = this.request.query;

    var product = req.product;

    var res = yield orderOperation.queryClientsByProduct(product);

    res.forEach(function(product) {

        product.displayDate = product.modifiedDate ? new Date(product.modifiedDate).toLocaleDateString("en-US", dateFormatting) : '';

    });

    this.body = res;
    this.status = 200;

});

router.get('/productsByKeywords', function*() {

    var req = this.request.query;

    var keywords = req.keywords;

    var res = yield productOperation.queryProductsByKeywords(keywords);

    res.forEach(function(product) {

        product.displayDate = product.modifiedDate ? new Date(product.modifiedDate).toLocaleDateString("en-US", dateFormatting) : '';

    });

    this.body = res;
    this.status = 200;

});

router.post('/updateClientPrice', function*() {

    var req = this.request.body;

    var clientProducts = req.clientProducts;

    yield orderOperation.updateClientPrice(clientProducts);

    this.body = clientProducts;
    this.status = 200;

});

function* getActiveProducts() {

    var allProducts = yield productOperation.queryProducts();

    var activeProducts = yield orderOperation.queryActiveProducts();




    let Products = activeProducts.map(function(product) {

        let name = product.name.trim();

        var index = allProducts.findIndex(product => name == product.name);


        if (index < 0) {

            return { _id: '', name: name, buyPrice: '', sellPrice: '', modifiedDate: '', status: '' };

        } else {

            let product = allProducts[index];

            return product;
        }

    });

    return activeProducts;

}






router.delete('/product/:id', function*() {
    var id = this.params.id;

    var res = yield productOperation.remove(id);
    this.body = res;
    this.status = 200;

});


exports.router = router;
