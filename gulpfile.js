var gulp = require('gulp');
var webserver = require('gulp-webserver');
var watch = require('gulp-watch');
var gulpCopy = require('gulp-copy');
var del = require('del');
var runSequence = require('run-sequence');
var sass = require("gulp-sass");


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
            host: '0.0.0.0', // Allow access for internal use
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
                config.nodeDir + '/bootstrap-sass/assets/stylesheets',
                config.nodeDir + '/font-awesome/scss'
            ]
        })).pipe(gulp.dest(config.dist + "/css"));
});


gulp.task('icons', function() { 
    return gulp.src(config.nodeDir + '/font-awesome/fonts/**.*') 
        .pipe(gulp.dest(config.dist + '/css/fonts')); 
});

/*Copy files in dist folder*/
gulp.task('copy', ['clean', 'scss'], function() {
    console.log('copying....');
    return gulp.src([
            './index.html',
            './app/**',
            '!./app/scss',
            '!./app/scss/**'
        ], { base: './' })
        .pipe(gulp.dest('./dist'));
});

/*Gulp bootstrap*/
gulp.task('default', function(done) {
    runSequence('copy', ['watch'], done);
});
