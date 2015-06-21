/**
 * Created by thram on 14/06/15.
 */
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    app = require('./server'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify');

gulp.task('express', function () {
    var express = require('express');
    app.use(require('connect-livereload')({port: 4002}));
    app.use(express.static(__dirname));
    app.listen(4000);
});

var tinylr;
gulp.task('livereload', function () {
    tinylr = require('tiny-lr')();
    tinylr.listen(4002);
});

function notifyLiveReload(event) {
    var fileName = require('path').relative(__dirname, event.path);

    tinylr.changed({
        body: {
            files: [fileName]
        }
    });
}

gulp.task('styles', function () {
    return sass('sass/app.scss', {style: 'expanded'})
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss()).pipe(gulp.dest('public/css'));
});

gulp.task('watch', function () {
    gulp.watch('sass/*.scss', ['styles']);
    gulp.watch('views/*.jade', notifyLiveReload);
    gulp.watch('scripts/*.js', ['compress']);
    gulp.watch('scripts/**/*.js', ['compress']);
    gulp.watch('controllers/*.js', notifyLiveReload);
    gulp.watch('routes/*.js', notifyLiveReload);
    gulp.watch('server.js', notifyLiveReload);
});

gulp.task('watch-debug', function () {
    gulp.watch('sass/*.scss', ['styles']);
    gulp.watch('views/*.jade', notifyLiveReload);
    gulp.watch('scripts/*.js', ['concat']);
    gulp.watch('scripts/**/*.js', ['concat']);
    gulp.watch('server.js', notifyLiveReload);
});

gulp.task('compress', function () {
    return gulp.src([
        'scripts/vendor/*.js',
        'scripts/toolbox/*.js',
        'scripts/components/*.js',
        'scripts/model/*.js',
        'scripts/views/*.js',
        'scripts/*.js'
    ]) //select all javascript files under js/ and any subdirectory
        .pipe(concat('app.min.js')) //the name of the resulting file
        .pipe(uglify())
        .pipe(gulp.dest('public/js'));//the destination folder;
});

gulp.task('concat', function () {
    return gulp.src([
        'scripts/vendor/*.js',
        'scripts/toolbox/*.js',
        'scripts/components/*.js',
        'scripts/model/*.js',
        'scripts/views/*.js',
        'scripts/*.js',
        'scripts/*.js'
    ]) //select all javascript files under js/ and any subdirectory
        .pipe(concat('app.min.js')) //the name of the resulting file
        .pipe(gulp.dest('public/js'));//the destination folder;
});

gulp.task('default', ['styles', 'compress', 'express', 'livereload', 'watch'], function () {
    return gulp.src('./server.js').pipe(notify({message: 'Server started'}));
});
gulp.task('debug', ['styles', 'concat', 'express', 'livereload', 'watch-debug'], function () {
    return gulp.src('./server.js').pipe(notify({message: 'Server started'}));
});