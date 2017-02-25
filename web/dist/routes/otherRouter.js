var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;
var userOperation = require('../data_access/user.js').collection;

router = new Router();

router.get('/settings', function*() {

    var _id = this.req.user._id;

    yield this.render('settings', {
        css: '',
        name: 'settings',
        header: '',
        footer: '',
        _id: _id

    });

});


router.get('/user/:id', function*() {

    var id = this.params.id

    var rs = yield userOperation.queryUserById(id);

    delete rs.password;

    this.body = rs;
    this.status = 200;

});


router.get('/tag', function*() {

    var _id = this.req.user._id;

    yield this.render('tag', {
        css: '',
        name: 'common',
        header: '',
        footer: ''

    });

});


exports.router = router;
