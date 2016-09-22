var Router = require('koa-router');
var ObjectID = require('mongodb').ObjectID;


router = new Router();
router.get('/register', function*() {

    yield this.render('register', {
        css:'',
        script: '',
        header: '',
        footer: ''

    });

});

exports.router = router;
