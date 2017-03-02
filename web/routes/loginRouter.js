var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;
const passport = require('koa-passport')
var userOperation = require('../data_access/user.js').collection;

router = new Router();


router.get('/', function*() {
    if (this.isAuthenticated()) {
        this.redirect('v3/index');

    } else {

        yield this.render('login', {
            name: 'registration',
            css: '',
            header: 'specific',
            footer: ''

        });
    }


});

router.get('/login', function*() {
    if (this.isAuthenticated()) {
        this.redirect('v3/index');

    } else {

        yield this.render('login', {
            name: 'registration',
            css: '',
            header: 'specific',
            footer: ''

        });
    }
});

router.post('/login', function*() {
    yield passport.authenticate('local', {
        successRedirect: 'v3/index',
        failureRedirect: 'v3/login',
        failureFlash: false
    })
});

router.get('/logout', function*() {
    this.logout()
    this.redirect('v3/login')
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
