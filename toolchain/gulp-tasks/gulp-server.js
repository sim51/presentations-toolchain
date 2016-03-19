var gulp = require('gulp');
var connect = require('gulp-connect');
var argv = require('yargs').argv;
var config = require('../../config.json');

/**
 * Server task
 */
gulp.task('webserver', function () {

    var rootPath = config.target_folder;
    var fallback;

    if(argv.prez) {
        var prezPath = config.target_folder + '/' + argv.prez.replace(/slides\//i, '');
        fallback = prezPath + 'index.html';
        rootPath = [prezPath, rootPath];
    }

    connect.server({
        port: config.server.port,
        livereload: true,
        root: rootPath,
        fallback: fallback
    });

});
