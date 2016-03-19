var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var watch = require('gulp-watch');
var less = require('gulp-less');
var connect = require('gulp-connect');
var config = require('../../config.json');


/**
 * Compile less file for all themes.
 */
gulp.task('themes-less', function () {
    var stream = gulp
        .src(config.theme.less.folder + config.theme.less.main)
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(gulp.dest(config.theme.dest))
        .pipe(connect.reload());
    return stream;
});

/**
 *  Copy all theme assets.
 */
gulp.task('themes-assets', function () {
    var stream = gulp
        .src(config.theme.assets)
        .pipe(gulp.dest(config.theme.dest))
        .pipe(connect.reload());
    return stream;
});

/**
 * Gulp theme watch.
 */
gulp.task('themes-watch', function () {

    // watching all less files
    watch(config.theme.less.folder + '**/*.less', {read: false, verbose: true}, function () {
        gulp.start("themes-less");
    });

    // watching all theme assets
    watch(config.theme.assets, {read: false, verbose: true}, function () {
        gulp.start("themes-assets");
    });

});

/**
 * Compile themes
 */
gulp.task('themes', ['themes-less', 'themes-assets']);
