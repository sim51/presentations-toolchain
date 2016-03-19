var gulp = require('gulp');
// Loading gulp task
require('require-dir')('./toolchain/gulp-tasks');


gulp.task('init', ['themes', 'asciidoctor-revealjs-install', 'revealjs-assets']);
gulp.task('generate', ['init', 'generate-presentations']);
gulp.task('watch', ['themes-watch', 'generate-watch']);

gulp.task('build', ['generate']);
gulp.task('default', ['build','webserver', 'watch']);
