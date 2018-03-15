var gulp = require('gulp');
var child_process = require('child_process');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
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

/**
 * Function that generate a presentation.
 *
 * @param folder Name of the presentation folder.
 */
function generateAsciidoctorPresentation(folder) {
    var source = config.slides_folder +  '/' + folder + "/slides/index.adoc";
    var dest = config.target_folder + '/' + folder;

    var cmd = config.generator.exec + dest + ' ' + source;

    try {
        fs.accessSync(source, fs.F_OK);
        // execute asciidoctor
        child_process.execSync(cmd, function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
        });
    } catch (e) {
        // do nothing
    }
}



/**
 * Install asciidoctor revealjs.
 */
gulp.task('asciidoctor-revealjs-install', function () {
    // checkout asciidoctor reveal backend
    try {
        fs.accessSync('./toolchain/asciidoctor-reveal.js', fs.F_OK);
        // Do nothing
    } catch (e) {
        child_process.execSync('git clone ' + config.generator.github_asciidoctor_revealjs + ' ./toolchain/asciidoctor-reveal.js', function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
        });
    }
});


/**
 * Copy revealjs assets into dist folder
 */
gulp.task('revealjs-assets', function () {
    var stream = gulp.src('node_modules/@(reveal.js)/**/*.*')
        .pipe(gulp.dest(config.target_folder))
        .pipe(connect.reload());
    return stream;
});

/**
 *  Generate asciidoctor presentation with assets
 */
gulp.task('generate-presentations', function () {

    var folderPath = config.slides_folder;
    var folders = getSubFoldersList(folderPath);

    if(argv.prez) {
        folders = [argv.prez.replace(/slides\//i, '')];
    }

    var tasks = folders.map(function(folder) {
        generateAsciidoctorPresentation(folder);
        var src = [config.slides_shared_folder];
        src.push(path.join(folderPath, folder, '@(assets)/**/*.*'));
        return gulp.src(src)
                    .pipe(gulp.dest(config.target_folder + '/' + folder));
    });

    gulp.src("").pipe(connect.reload());

    return tasks;
});

/**
 * Gulp watch.
 */
gulp.task('generate-watch', function () {

    var folderPath = config.slides_folder;
    if(argv.prez) {
        folderPath = argv.prez;
    }
    var watchExp = [folderPath + '/**/*.*', '!' + folderPath + '/**/*.adoc.*', '!' + folderPath + '/dist'];
    watchExp.push(config.slides_shared_folder + '/**/*.*');
    watchExp.push('!' + config.slides_shared_folder + '/**/*.adoc.*');

    // watching all asciidoctor
    watch(watchExp, {read: false, verbose: true}, function () {
        gulp.start('generate-presentations');
    });

});

