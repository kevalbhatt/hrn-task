var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    watch = require('gulp-watch'),
    gulpCopy = require('gulp-copy'),
    del = require('del'),
    runSequence = require('run-sequence'),
    sass = require("gulp-sass"),
    fileinclude = require('gulp-file-include');

var config = {
    scssPath: './app/scss',
    nodeDir: './node_modules' ,
    dist: './dist',
    libs: './dist/libs',
    app: './app'
};

/*Gulp server config*/
gulp.task('webserver', function() {
    return gulp.src('./dist')
        .pipe(webserver({
            port: '9999',
            host: '127.0.0.1', // use 0.0.0.0 IP to allow access for internal use (LAN)
            livereload: true,
            open: true // open default browser
        }));
});

gulp.task('clean', function() {
    del.sync(['./dist/**/*', '!dist']);
});

/*Watch for file change and call copy task*/
gulp.task('watch', ['webserver'], function() {
    return watch(['index.html', 'app/**/*.scss', 'app/**/*.js', 'app/**/*.html'], function() {
        gulp.start("copy");
    });
});

gulp.task("scss", ['icons'], function() {
    return gulp.src(config.app + "/scss/style.scss")
        .pipe(sass({
            style: 'compressed',
            includePaths: [
                config.scssPath,
                config.nodeDir + '/sass-mq',
                config.nodeDir + '/bootstrap-sass/assets/stylesheets',
                config.nodeDir + '/font-awesome/scss'
            ]
        })).pipe(gulp.dest(config.dist + "/css"));
});


gulp.task('icons', function() {
    return gulp.src(config.nodeDir + '/font-awesome/fonts/**.*')
        .pipe(gulp.dest(config.dist + '/fonts'));
});

gulp.task('fileinclude', function() {
    gulp.src(['index.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(config.dist));
});

/*Copy files in dist folder*/
gulp.task('copy', ['clean', 'scss', 'fileinclude'], function() {
    console.log('copying....');
    return gulp.src([
            './app/img/**'
        ], { base: './app' })
        .pipe(gulp.dest('./dist'));
});

/*Gulp bootstrap*/
gulp.task('default', function(done) {
    runSequence('copy', ['watch'], done);
});