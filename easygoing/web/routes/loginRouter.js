var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;
const passport = require('koa-passport')
var userOperation = require('../data_access/user.js').collection;

router = new Router();


router.get(/^\/(v3\.1)?$/, function*() {
    /*    if (this.isAuthenticated()) {
            this.redirect('/v3.1/index');

        } else {
            this.redirect('/v3.1/login');

        }*/

    this.redirect('/v3.1/index');

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
    /*    yield passport.authenticate('local', {
            successRedirect: '/v3.1/index',
            failureRedirect: '/v3.1/login',
            failureFlash: false
        })*/

    var s = this.request.body;

    yield passport.authenticate('local', function* (err, user, info) {
        if (user) {
            var res = yield this.logIn(user, function(err) {

                return res;


            });
        }else{
            return err;

        }

    });

    return {ok:true};



});

router.get('/logout', function*() {
    this.logout()
    this.redirect('/v3.1/login')
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
