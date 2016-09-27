var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;
const operation = require('../data_access/user.js').collection;

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
    var res = yield operation.insertOne(user);
    this.body = res;
    this.status = 200;

});

exports.router = router;
