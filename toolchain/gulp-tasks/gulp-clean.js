var gulp = require('gulp');
var clean = require('gulp-clean');
var config = require('../../config.json');

/**
 * Cleaning all temp files.
 */
gulp.task('clean', function () {
    var stream = gulp
      .src(config.clean.folder, {read: false})
      .pipe(clean());
    return stream;
});
