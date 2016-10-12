var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;
var userOperation = require('../data_access/user.js').collection;

router = new Router();
router.get('/register', function*() {

    yield this.render('register', {
        css:'',
        script: '',
        header: '',
        footer: ''

    });

});

router.post('/user', function*() {

    var user = this.request.body;

    yield rs= userOperation.insertOne(user);

    this.body = rs;
    this.status = 200;

});
exports.router = router;
