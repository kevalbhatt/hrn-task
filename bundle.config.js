// bundle.config.js 
var sass = require("gulp-sass");

function minifyNeeded() {
    return process.env.NODE_ENV === 'production' ? true : false
}

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
                minCSS: minifyNeeded(),
                maps: false,
                uglify: minifyNeeded(),
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
                './node_modules/jquery/dist/jquery.js',
                './node_modules/aos/dist/aos.js',
                './node_modules/bootstrap-sass/assets/javascripts/bootstrap.js'
            ],
            styles: ['./node_modules/aos/dist/aos.css', config.app + '/scss/vendor.scss'],
            options: {
                maps: false,
                order: {
                    scripts: [
                        '**/jquery.js',
                        '**/aos.js',
                        '**/bootstrap.js'
                    ]
                },
                transforms: {
                    styles: function(argument) {
                        return sass({
                            style: 'compressed',
                            includePaths: [
                                config.scssPath,
                                config.nodeDir + '/bootstrap-sass/assets/stylesheets',
                                config.nodeDir + '/font-awesome/scss',
                                config.nodeDir + '/roboto-fontface/css/roboto/sass'
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
    },{
        src: config.nodeDir + "/roboto-fontface/fonts/roboto/**.*",
        base: config.nodeDir + "/roboto-fontface"
    }]
};