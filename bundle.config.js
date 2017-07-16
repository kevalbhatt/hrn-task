// bundle.config.js 
var sass = require("gulp-sass");
var config = {
    scssPath: './app/scss',
    nodeDir: './node_modules',
    dist: './public',
    libs: './public/libs',
    app: './app'
};

module.exports = {
    directoryPath: config,
    bundle: {
        app: {
            styles: [config.app + '/scss/style.scss'],
            options: {
                minCSS: true,
                maps: false,
                transforms: {
                    styles: function(argument) {
                        return sass({
                            style: 'compressed',
                            includePaths: [
                                config.scssPath,
                                config.nodeDir + '/sass-mq'
                            ]
                        });
                    }
                }
            }
        },
        vendor: {
            scripts: [
                './node_modules/aos/dist/aos.js',
                './node_modules/jquery/dist/jquery.js',
                './node_modules/bootstrap-sass/assets/javascripts/bootstrap.js'
            ],
            styles: ['./node_modules/aos/dist/aos.css', config.app + '/scss/vendor.scss'],
            options: {
                maps: false,
                transforms: {
                    styles: function(argument) {
                        return sass({
                            style: 'compressed',
                            includePaths: [
                                config.scssPath,
                                config.nodeDir + '/bootstrap-sass/assets/stylesheets',
                                config.nodeDir + '/font-awesome/scss'
                            ]
                        });
                    }
                }
            }
        }
    },
    copy: [{
        src: './app/**/*.{png,svg,jpg}',
        base: './app'
    }, {
        src: config.nodeDir + "/font-awesome/fonts/**.*",
        base: config.nodeDir + "/font-awesome"
    }]
};