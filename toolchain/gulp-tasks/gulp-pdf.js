var gulp = require('gulp');
var child_process = require('child-process-promise');
var connect = require('gulp-connect');
var fs = require('fs');
var path = require('path');
var argv = require('yargs').argv;
var config = require('../../config.json');

/**
 * Function that return the sub folder list of a folder.
 *
 * @param dir The parent folder path
 */
function getSubFoldersList(dir) {
    return fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

function generatePDFPresentation(url, pdfPath) {
  console.log("PDF from " + url);
  var cmd = config.pdf.exec + '"' + url + '" ' + pdfPath;
  console.log(cmd);
  return child_process.exec(cmd);
}

/**
 * Print as PDF file
 */
gulp.task('pdf', ['build'], function () {

    // Create a server
    connect.server({
        port: config.pdf.port,
        root: config.target_folder
    });

    var folderPath = config.slides_folder;
    var folders = getSubFoldersList(folderPath);
    if(argv.prez) {
        folders = [argv.prez.replace(/slides\//i, '')];
    }

    var tasks = folders.map(function(folder) {
        var url = 'http://localhost:' + config.pdf.port + '/' + folder + '/index.html';
        var pdfPath = config.target_folder + '/' + folder + '/slides.pdf';
        return generatePDFPresentation(url, pdfPath);
    });

    Promise.all(tasks).then(function() {
        connect.serverClose();
    });

});
