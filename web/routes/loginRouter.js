var Router = require('koa-router');
const passport = require('koa-passport')

router = new Router();

router.get('/', function*() {
    yield this.render('login', {
        script: '',
        css: '',
        header: 'specific',
        footer: ''

    });
});
router.get('/login', function*() {
    yield this.render('login', {
        script: '',
        css: '',
        header: 'specific',
        footer: ''

    });
});

router.post('/login', function*() {
    yield passport.authenticate('local', {
        successRedirect: '/index',
        failureRedirect: '/login',
        failureFlash: false
    })
});

router.get('/logout', function* () {
    this.logout()
    this.redirect('/login')
});

exports.router = router;
