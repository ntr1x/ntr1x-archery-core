var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var cleancss = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('scripts', function() {
    return gulp.src(['src/**/*.js'])
        .pipe(sourcemaps.init())
        // .pipe(browserify())
        .pipe(concat('core.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/'))
})

gulp.task('styles', function() {
    return gulp.src(['src/**/*.css'])
        .pipe(sourcemaps.init())
        .pipe(cleancss())
        .pipe(concat('core.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/'));
})

gulp.task('templates', function() {
    return gulp.src(['src/**/*.htm'])
        .pipe(sourcemaps.init())
        .pipe(concat('core.htm'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/'));
})

gulp.task('default', [
    'scripts',
    'styles',
    'templates',
])

gulp.task('watch', function() {

    gulp.start('default');

    gulp.watch('src/**/*.js', [ 'scripts' ])
    gulp.watch('src/**/*.css', [ 'styles' ])
    gulp.watch('src/**/*.htm', [ 'templates' ])
})
