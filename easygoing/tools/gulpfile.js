var gulp = require('gulp');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var filesize = require('gulp-filesize');
const sourcemaps = require('gulp-sourcemaps');
var inject = require('gulp-inject');
var uglifycss = require('gulp-uglifycss');
var bowerFiles = require('main-bower-files');
var series = require('stream-series');
var replace = require('gulp-replace');
var gnf = require('gulp-npm-files');
var requirejsOptimize = require('gulp-requirejs-optimize');


const babel = require('gulp-babel');
var Server = require('karma').Server;

gulp.task('test', function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();

});

gulp.task('clean', function(done) {
    return gulp.src('../web-built', { read: false })
        .pipe(clean());
    done();
});



gulp.task('inject', function(done) {
    //, ['clean', 'copy', 'commonjs', 'pagejs', 'css', 'bower-components', 'components']
    setTimeout(function() {

        //component page
        var views = ['settings', 'registration'];
        var stream = gulp.src(`../web/views/script.html`,{base:'../web/'});

        stream.pipe(replace(/[ ]*<script.+<\/script>[ ]*\n/img, ''));
        views.forEach(function(name) {
            var bowerStream = gulp.src(bowerFiles({ group: 'angular' }), { read: false });
            var appStream = gulp.src(`../web-built/public/js/${name}/${name}.min.js`, { read: false });
            stream.pipe(inject(series(bowerStream, appStream), { name: `${name}`, ignorePath: ['/web-built/public', '/public'], addRootSlash: false }))
        });


        //require page
        var requiredViews = ['index', 'reckoning-orders'];
        requiredViews.forEach(function(name) {
            var bowerStream = gulp.src(bowerFiles({ group: `require` }), { read: false });
            stream.pipe(inject(bowerStream, { name: `${name}`, ignorePath: ['/web-built/public', '/public'], addRootSlash: false }))
        });


        //common page with customized script
        var mvvmViews = ['receivedOrders'];
        mvvmViews.forEach(function(name) {
            var bowerStream = gulp.src(bowerFiles({ group: `common` }), { read: false });
            var appStream = gulp.src([`../web-built/public/js/common.min.js`, `../web-built/public/js/${name}.js`], { read: false });
            stream.pipe(inject(series(bowerStream, appStream), { name: `${name}`, ignorePath: ['/web-built/public', '/public'], addRootSlash: false }))
        });

        //common page  without customized script

        var bowerStream = gulp.src(bowerFiles({ group: `common` }), { read: false });
        var appStream = gulp.src(`../web-built/public/js/common.min.js`, { read: false });
        stream.pipe(inject(series(bowerStream, appStream), { name: `common`, ignorePath: ['/web-built/public', '/public'], addRootSlash: false }))

        stream.pipe(gulp.dest('../web-built/'));

        done();



    }, 500);



});

gulp.task('bower-components', function(done) {

    gulp.src(bowerFiles({
            paths: {
                //bowerDirectory: '../web/',
                bowerrc: '../web/.bowerrc',
                bowerJson: '../web/bower.json'
            }
        }), { base: '../web/' })
        .pipe(gulp.dest('../web-built/'));

    done();

});

gulp.task('components', function(done) {

    var components = ['settings', 'registration'];

    for (var i = 0; i < components.length; i++) {
        var name = components[i];
        gulp.src([`../web/public/js/${name}/*.module.js`, `../web/public/js/${name}/*.component.js`, `!../web/public/js/${name}/*.spec.js`], { base: '../web/' })
            .pipe(sourcemaps.init())
            .pipe(babel({ presets: ['babel-preset-es2015'] }))
            .pipe(concat(`${name}.min.js`))
            .pipe(uglify({ mangle: false }))
            .pipe(sourcemaps.write('.', { includeContent: false }))
            .pipe(gulp.dest(`../web-built/public/js/${name}`));

        gulp.src([`../web/public/js/${name}/*.template.html`], { base: '../web/' })
            .pipe(gulp.dest('../web-built/'));
    }

    done();


});

gulp.task('requirejs', function() {
    return gulp.src('../web/public/js/main.js')
        .pipe(requirejsOptimize({
            mainConfigFile: './public/js/main.js',
            optimize: "none"
        }))
        .pipe(gulp.dest('../web-built/public/js/main.js'));
});

gulp.task('commonjs', function(done) {

    gulp.src(['../web/public/js/common.js'], { base: '../web/' })
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['babel-preset-es2015'] }))
        .pipe(concat(`common.min.js`))
        .pipe(uglify())
        // .pipe(uglify({mangle:false}))
        .pipe(sourcemaps.write('.', { includeContent: false }))
        .pipe(gulp.dest(`../web-built/public/js`));

    done();
});

gulp.task('pagejs', function(done) {

    gulp.src([`../web/public/js/*.js`, `!../web/public/js/!(knockout.mapping.2.4.1).min.js`, `!../web/public/js/common.js`], { base: '../web/' })
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['babel-preset-es2015'] }))
        //.pipe(concat(`all.min.js`))
        .pipe(uglify())
        /* .pipe(uglify({mangle:false}))*/
        .pipe(sourcemaps.write('.', { includeContent: false }))
        .pipe(gulp.dest(`../web-built/`));

    done();
});


gulp.task('css', function(done) {

    gulp.src([`../web/public/css/*.css`, `!../web/public/css/font-awesome.css`], { base: '../web/' })
        .pipe(concat(`public/css/all.min.css`))
        .pipe(uglifycss())
        .pipe(gulp.dest(`../web-built/`));

    done();
});


gulp.task('copy', ['clean'], function(done) {
    gulp.src(['../web/app.js', '../web/process.json', '../web/package.json', '../web/views/*.html', '!../web/views/script.html', '../web/data_access/*.js', '../web/routes/*.js', '../web/public/fonts/*.*'], { base: '../web/' })
        .pipe(gulp.dest('../web-built/'));

   // gulp.src(gnf(null,'../web/package.json'),{base:'../web/'}).pipe(gulp.dest('../web-built'));

    done();

});

gulp.task('npm', function(done) {

    var source=gnf(null,'../web/package.json');

    var revisedSource=source.map(function(item){

        return item.replace('./','../web/');

    });

    gulp.src(revisedSource,{base:'../web/'}).pipe(gulp.dest('../web-built/'));

    done();

});

gulp.task('default', ['clean', 'copy','npm', 'commonjs', 'pagejs', 'css', 'bower-components', 'components'], function(done) {

    done();

});


