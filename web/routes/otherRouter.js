var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;
var userOperation = require('../data_access/user.js').collection;

router = new Router();
router.get('/register', function*() {

    yield this.render('register', {
        css: '',
        script: '',
        header: '',
        footer: ''

    });

});

router.get('/settings', function*() {

    var _id = this.req.user._id;

    yield this.render('settings', {
        css: '',
        script: '',
        header: '',
        footer: '',
        _id: _id

    });

});

router.post('/user', function*() {

    var user = this.request.body;

    if (ObjectID.isValid(user._id)) {

        rs = yield userOperation.updateOne(user);
    } else {
        rs = yield userOperation.insertOne(user);

    }


    this.body = user;
    this.status = 200;

});
router.get('/user/:id', function*() {

    var id = this.params.id

    var rs = yield userOperation.queryUserById(id);

    this.body = rs;
    this.status = 200;

});
exports.router = router;
