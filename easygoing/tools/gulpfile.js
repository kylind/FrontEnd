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

var presets = ['babel-preset-es2015'].map(require.resolve);

var bowerConfig = {
    paths: {
        //bowerDirectory: '../web/',
        bowerrc: '../web/.bowerrc',
        bowerJson: '../web/bower.json'
    }
};

gulp.task('test', function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();

});

gulp.task('clean', function(done) {
    return gulp.src(['../web-built/*', '!../web-built/node_modules'], { read: false })
        .pipe(clean({ force: true }));
    done();
});



gulp.task('inject', function(done) {
    //, ['clean', 'copy', 'commonjs', 'pagejs', 'css', 'bower-components', 'components']
    setTimeout(function() {


        var stream = gulp.src(`../web/views/script.html`, { base: '../web/' });

        stream.pipe(replace(/[ ]*<script.+<\/script>[ ]*\n/img, ''));


        //require page
        var requiredViews = ['index'];
        requiredViews.forEach(function(name) {

            bowerConfig.group = 'require';
            var bowerStream = gulp.src(bowerFiles(bowerConfig), { read: false });
            stream.pipe(inject(bowerStream, { name: `${name}`, ignorePath: ['../web/public', '/public'], addRootSlash: false }))
        });

        stream.pipe(gulp.dest('../web-built/'));



        done();



    }, 500);



});

gulp.task('bower-components', ['clean'], function(done) {

    delete bowerConfig.group;

    gulp.src(bowerFiles(bowerConfig), { base: '../web/' })
        .pipe(gulp.dest('../web-built/'));

    done();

});


gulp.task('components', ['clean'], function(done) {

    var components = ['registration']; //'settings',

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

gulp.task('components-html', ['clean'], function(done) {

    var components = ['registration', 'settings'];

    for (var i = 0; i < components.length; i++) {
        var name = components[i];

        gulp.src([`../web/public/js/${name}/*.template.html`], { base: '../web/' })
            .pipe(gulp.dest('../web-built/'));
    }

    done();

});

gulp.task('requirejs', ['clean'], function() {



    bowerConfig.group = 'require';
    gulp.src(bowerFiles(bowerConfig), { base: '../web/' })
        .pipe(gulp.dest('../web-built/'))

    gulp.src([`../web/public/js/requireConfig.js`], { base: '../web/' })
        .pipe(babel({ presets: ['babel-preset-es2015'] }))
        .pipe(uglify())
        .pipe(gulp.dest(`../web-built/`));

    gulp.src('../web/public/js/common.js')
        .pipe(requirejsOptimize({
            baseUrl: "../web/public/components",
            mainConfigFile: './requireConfig.js',
            optimize: "none",
            name: "common"
        }))
        .pipe(babel({ presets: presets }))
        .pipe(uglify({mangle:true}))
        .pipe(gulp.dest('../web-built/public/js/'));

    gulp.src('../web/public/js/common-angular.js')
        .pipe(requirejsOptimize({
            baseUrl: "../web/public/components",
            mainConfigFile: './requireConfig.js',
            optimize: "none",
            name: "commonAngular"
        }))
        .pipe(gulp.dest('../web-built/public/js/'));

    gulp.src('../web/public/js/angular-app.js',{base:'../web/public/js/'})
        .pipe(requirejsOptimize({
            baseUrl: "../web/public/components",
            mainConfigFile: './requireConfig.js',
            name: "angularApp",
            optimize: "none",
            exclude: ['commonAngular']
        }))
        .pipe(babel({ presets: presets }))
        .pipe(uglify({mangle:false}))
        .pipe(gulp.dest('../web-built/public/js/'));

   gulp.src('../web/public/js/main.js')
        .pipe(requirejsOptimize({
            baseUrl: "../web/public/components",
            mainConfigFile: './requireConfig.js',
            optimize: "none",
            name: "../js/main",
            exclude: ['common', 'commonAngular']
        }))
        .pipe(babel({ presets: presets }))
        .pipe(uglify({mangle:true}))
        .pipe(gulp.dest('../web-built/public/js/'));


    gulp.src('../web/public/js/main-login.js')
        .pipe(requirejsOptimize({
            baseUrl: "../web/public/components",
            mainConfigFile: './requireConfig.js',
            optimize: "none",
            name: "../js/main-login",
            exclude: ['angularApp']
        }))
        .pipe(babel({ presets: presets }))
        .pipe(uglify())
        .pipe(gulp.dest('../web-built/public/js/'));
});

gulp.task('zip', function() {

    var presets = ['babel-preset-es2015'].map(require.resolve);
    console.log(presets[0]);

    gulp.src('../web-built/public/js/angular-app.js',{base:'../web-built/public/js/'})
        .pipe(babel({ presets: presets }))
        .pipe(uglify({mangle:true}))
        .pipe(gulp.dest('../web-built/public/js/'));
});


gulp.task('commonjs', ['clean'], function(done) {

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

gulp.task('pagejs', ['clean'], function(done) {

    gulp.src([`../web/public/js/*.js`, `!../web/public/js/!(knockout.mapping.2.4.1).min.js`, `!../web/public/js/common.js`], { base: '../web/' })
        //.pipe(sourcemaps.init())
        .pipe(babel({ presets: ['babel-preset-es2015'] }))
        //.pipe(concat(`all.min.js`))
        .pipe(uglify())
        /* .pipe(uglify({mangle:false}))*/
        //.pipe(sourcemaps.write('.', { includeContent: false }))
        .pipe(gulp.dest(`../web-built/`));

    done();
});


gulp.task('css', ['clean'], function(done) {

    gulp.src([`../web/public/css/*.css`, `!../web/public/css/font-awesome.css`], { base: '../web/' })
        .pipe(concat(`public/css/all.min.css`))
        .pipe(uglifycss())
        .pipe(gulp.dest(`../web-built/`));

    done();
});


gulp.task('copy', ['clean'], function(done) {
    gulp.src(['../web/app.js', '../web/process.json', '../web/package.json', '../web/public/images/*.*','../web/views/*.html', '!../web/views/script.html', '../web/data_access/*.js', '../web/routes/*.js', '../web/public/fonts/*.*'], { base: '../web/' })
        .pipe(gulp.dest('../web-built/'));

    // gulp.src(gnf(null,'../web/package.json'),{base:'../web/'}).pipe(gulp.dest('../web-built'));

    done();

});



gulp.task('npm', function(done) {

    gulp.src(['../web/node_modules/*/*.*'], { base: '../web/' })
        .pipe(gulp.dest('../web-built/'));

    done();



    /*    var source = gnf(null, '../web/package.json');

        var revisedSource = source.map(function(item) {

            return item.replace('./', '../web/');

        });

        gulp.src(revisedSource, { base: '../web/' }).pipe(gulp.dest('../web-built/'));

        done();*/

});

gulp.task('default', ['clean', 'copy', 'pagejs', 'css', 'bower-components', 'components'], function(done) {

    done();

});
gulp.task('require', ['clean', 'copy', 'css', 'components-html', 'requirejs'], function(done) {

    done();

});
