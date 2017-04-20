var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var config = require('../../config.json');

/**
 * Deploy target folder to gh-pages.
 **/
gulp.task('gh-pages', ['build', 'pdf'], function() {
    return gulp.src(config.target_folder + '/**/*')
        .pipe(ghPages(config.ghPages));
});
