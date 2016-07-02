var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var cleancss = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('core-scripts', function() {
    return gulp.src(['src/**/*.js'])
        .pipe(sourcemaps.init())
        // .pipe(browserify())
        .pipe(concat('core.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/'))
})

gulp.task('core-styles', function() {
    return gulp.src(['src/**/*.css'])
        .pipe(sourcemaps.init())
        .pipe(cleancss())
        .pipe(concat('core.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/'));
})

gulp.task('core-templates', function() {
    return gulp.src(['src/**/*.htm'])
        .pipe(sourcemaps.init())
        .pipe(concat('core.htm'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/'));
})

gulp.task('default', [
    'core-scripts',
    'core-styles',
    'core-templates',
])

gulp.task('watch', function() {

    gulp.start('default');

    gulp.watch('src/**/*.js', [ 'core-scripts' ])
    gulp.watch('src/**/*.css', [ 'core-styles' ])
    gulp.watch('src/**/*.htm', [ 'core-templates' ])
})
