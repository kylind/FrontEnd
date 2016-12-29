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
    return gulp.src('dist', { read: false })
        .pipe(clean());
    done();
});



gulp.task('inject', function(done) {
//, ['clean', 'copy', 'commonjs', 'pagejs', 'css', 'bower-components', 'components']
    setTimeout(function() {

        //component page
        var views = ['settings', 'registration'];
        var stream = gulp.src(`views/script.html`, { base: './' });

        stream.pipe(replace(/[ ]*<script.+<\/script>[ ]*\n/img, ''));
        views.forEach(function(name) {
            var bowerStream = gulp.src(bowerFiles({ group: 'angular' }), { read: false });
            var appStream = gulp.src(`dist/public/js/${name}/${name}.min.js`, { read: false });
            stream.pipe(inject(series(bowerStream, appStream), { name: `${name}`, ignorePath: ['/dist/public', '/public'] }))
        });


        //require page
        var requiredViews = ['index', 'reckoning-orders'];
        requiredViews.forEach(function(name) {
            var bowerStream = gulp.src(bowerFiles({ group: `require` }), { read: false });
            stream.pipe(inject(bowerStream, { name: `${name}`, ignorePath: ['/dist/public', '/public'] }))
        });


        //common page with customized script
        var mvvmViews = ['receivedOrders'];
        mvvmViews.forEach(function(name) {
            var bowerStream = gulp.src(bowerFiles({ group: `common` }), { read: false });
            var appStream = gulp.src([`dist/public/js/common.min.js`, `dist/public/js/${name}.js`], { read: false });
            stream.pipe(inject(series(bowerStream, appStream), { name: `${name}`, ignorePath: ['/dist/public', '/public'] }))
        });

        //common page  without customized script

        var bowerStream = gulp.src(bowerFiles({ group: `common` }), { read: false });
        var appStream = gulp.src(`dist/public/js/common.min.js`, { read: false });
        stream.pipe(inject(series(bowerStream, appStream), { name: `common`, ignorePath: ['/dist/public', '/public'] }))

        stream.pipe(gulp.dest('./dist'));

        done();



    }, 500);



});

gulp.task('bower-components', function(done) {

    gulp.src(bowerFiles(), { base: './' })
        .pipe(gulp.dest('dist'));

    done();

});

gulp.task('components', function(done) {

    var components = ['settings', 'registration'];

    for(var i=0;i<components.length;i++){
        var name =components[i];
        gulp.src([`public/js/${name}/*.module.js`, `public/js/${name}/*.component.js`, `!public/js/${name}/*.spec.js`], { base: './' })
            .pipe(sourcemaps.init())
            .pipe(babel({ presets: ['babel-preset-es2015'] }))
            .pipe(concat(`${name}.min.js`))
            .pipe(uglify({mangle:false}))
            .pipe(sourcemaps.write('.', { includeContent: true }))
            .pipe(gulp.dest(`dist/public/js/${name}`));

        gulp.src([`public/js/${name}/*.template.html`], { base: './' })
            .pipe(gulp.dest('dist'));
    }

    done();


});

gulp.task('requirejs', function () {
    return gulp.src('./public/js/main.js')
        .pipe(requirejsOptimize({
            mainConfigFile: './public/js/main.js',
            optimize: "none"
        }))
        .pipe(gulp.dest('dist/public/js/main.js'));
});

gulp.task('commonjs', function(done) {

    gulp.src(['public/js/common.js'], { base: './' })
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['babel-preset-es2015'] }))
        .pipe(concat(`common.min.js`))
        .pipe(uglify())
        // .pipe(uglify({mangle:false}))
        .pipe(sourcemaps.write('.', { includeContent: true }))
        .pipe(gulp.dest(`dist/public/js`));

    done();
});

gulp.task('pagejs', function(done) {

    gulp.src([`public/js/*.js`, `!public/js/!(knockout.mapping.2.4.1).min.js`, `!public/js/common.js`], { base: './' })
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['babel-preset-es2015'] }))
        //.pipe(concat(`all.min.js`))
       .pipe(uglify())
        /* .pipe(uglify({mangle:false}))*/
        .pipe(sourcemaps.write('.', { includeContent: true }))
        .pipe(gulp.dest(`dist`));

    done();
});


gulp.task('css', function(done) {

    gulp.src([`public/css/*.css`, `!public/css/font-awesome.css`], { base: './' })
        .pipe(concat(`public/css/all.min.css`))
        .pipe(uglifycss())
        .pipe(gulp.dest(`dist`));

    done();
});


gulp.task('copy', ['clean'], function(done) {
    gulp.src(['./app.js', './process.json', './package.json', 'views/*.html', '!views/script.html', 'data_access/*.js', 'routes/*.js', 'public/fonts/*.*'], { base: './' })
        .pipe(gulp.dest('dist'));

    gulp.src(gnf(), { base: './' }).pipe(gulp.dest('./dist'));

    done();

});

gulp.task('default', ['clean', 'copy', 'commonjs', 'pagejs', 'css', 'bower-components', 'components'], function(done) {

        done();

});
