var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    watch = require('gulp-watch'),
    gulpCopy = require('gulp-copy'),
    del = require('del'),
    runSequence = require('run-sequence'),
    bundle = require('gulp-bundle-assets'),
    fileinclude = require('gulp-file-include'),
    config = require('./bundle.config.js').directoryPath,
    w3cjs = require('gulp-w3cjs');

function requireUncached(module) {
    delete require.cache[require.resolve(module)]
    return require(module)
}

gulp.task('fileinclude', ['bundle'], function() {
    return gulp.src(['index.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            context: {
                fileUrls: requireUncached('./bundle.result.json')
            }
        }))
        .pipe(gulp.dest(config.dist));
});

gulp.task('bundle', ['clean'], function() {
    return gulp.src('./bundle.config.js')
        .pipe(bundle())
        .pipe(bundle.results('./'))
        .pipe(gulp.dest(config.dist));
});

gulp.task('clean', function() {
    return del.sync(['./public/**/*', '!public']);
});

/*Gulp server config*/
gulp.task('webserver', function() {
    return gulp.src('./public')
        .pipe(webserver({
            port: '9999',
            host: '127.0.0.1', // use 0.0.0.0 IP to allow access for internal use (LAN)
            livereload: true,
            open: true // open default browser
        }));
});


/*Watch for file change and call copy task*/
gulp.task('watch', ['webserver'], function() {
    return watch(['index.html', 'app/**/*.scss', 'app/**/*.js', 'app/**/*.html'], function() {
        gulp.start("fileinclude");
    });
});

/*Gulp bootstrap*/
gulp.task('default', function(done) {
    runSequence('fileinclude', ['watch'], done);
});

gulp.task('w3c-html-validate', ['fileinclude'], function() {
    gulp.src('public/*.html')
        .pipe(w3cjs())
        .pipe(w3cjs.reporter());
});