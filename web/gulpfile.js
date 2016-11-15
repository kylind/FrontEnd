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



gulp.task('inject', function() {

    var views = ['settings', 'index'];
    var stream = gulp.src(`views/script.html`, { base: './' });
    views.forEach(function(name) {

        var bowerStream = gulp.src(bowerFiles({group: `${name}`}), { read: false });
        var appStream = gulp.src('dist/public/js/${name}/${name}.min.js', { read: false });
        stream.pipe(inject(series(bowerStream, appStream), { name: `${name}` }))

    });
    stream.pipe(dest('dist'));

});

gulp.task('bower-components',['clean'], function() {

    gulp.src(bowerFiles(),{base:'./'})
        .pipe(gulp.dest('dist'));

});

gulp.task('components', ['copy'], function() {

    var components = ['settings', 'registration'];

    components.forEach(function(name) {
        gulp.src([`public/js/${name}/*.module.js`, `public/js/${name}/*.component.js`], { base: './' })
            .pipe(sourcemaps.init())
            .pipe(babel({ presets: ['babel-preset-es2015'] }))
            .pipe(concat(`${name}.min.js`))
            .pipe(uglify())
            .pipe(sourcemaps.write('.', { includeContent: true }))
            .pipe(gulp.dest(`dist/public/js/${name}`));

        gulp.src([`public/js/${name}/*.template.html`], { base: './' })
            .pipe(gulp.dest('dist'));

    });


});

gulp.task('css', ['clean'], function() {

    gulp.src([`public/css/*.css`, `!public/css/font-awesome.css`], { base: './' })
        .pipe(concat(`public/css/all.min.css`))
        .pipe(uglifycss())
        .pipe(gulp.dest(`dist`));
});

gulp.task('js', ['clean'], function() {


    gulp.src([`public/js/*.js`, `!public/js/*.min.js`, `!public/js/main-*.js`, `public/js/knockout.mapping.2.4.1.min.js`], { base: './' })
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['babel-preset-es2015'] }))
        .pipe(concat(`all.min.js`))
        .pipe(uglify())
        .pipe(sourcemaps.write('.', { includeContent: true }))
        .pipe(gulp.dest(`dist/public/js`));

});

gulp.task('copy', ['clean'], function() {
    gulp.src(['views/*.html', 'data_access/*.js', 'routes/*.js', 'public/fonts/*.*', 'node_modules/**/*.*'], { base: './' })
        .pipe(gulp.dest('dist'));

});
