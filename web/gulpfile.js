var gulp = require('gulp');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var filesize = require('gulp-filesize');
const sourcemaps = require('gulp-sourcemaps');
var inject=require('gulp-inject');

const babel = require('gulp-babel');
var Server = require('karma').Server;

gulp.task('test', function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();

});

gulp.task('clean', function (done) {
  return gulp.src('dist', {read: false})
    .pipe(clean());
    done();
});

gulp.task('settings', function() {
    gulp.src(['public/components/settings/*.module.js', 'public/components/settings/*.component.js'])
        .pipe(sourcemaps.init())
        .pipe(babel({presets:['babel-preset-es2015']}))
        .pipe(concat('settings.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.', {includeContent:true}))
        .pipe(gulp.dest('dist/public/components'));

    gulp.src(['public/components/settings/*.template.html'])
        .pipe(sourcemaps.init())
        .pipe(gulp.dest('dist/public/components'));

});
