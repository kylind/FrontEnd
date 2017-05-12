var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;
const passport = require('koa-passport')
var userOperation = require('../data_access/user.js').collection;

var Collection = require('../data_access/order.js').Collection;

router = new Router();


router.get(/^\/(v4\.1)?$/, function*() {


    this.redirect('/v4.1/index');

});

router.get('/login', function*() {

    if (this.isAuthenticated()) {
        this.redirect('v4.1/index');

    } else {

        yield this.render('login', {
            name: 'registration',
            css: '',
            header: 'specific',
            footer: ''

        });
    }
});

router.post('/login', function*(next) {


    var ctx = this;

    yield passport.authenticate('local', function*(err, user, info) {
        if (!user) {
            ctx.status = 401;
            ctx.body = { success: false };
        } else {
            ctx.body = { success: true }
            yield ctx.login(user);

        }

    });

});

router.get('/logout', function*() {


    if (this.isAuthenticated()) {
        this.logout();
    }

    this.body = { success: true };

    //this.redirect('/v4/login');
});

router.get('/register', function*() {

    yield this.render('register', {
        css: '',
        name: 'registration',
        header: '',
        footer: ''

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

exports.router = router;
