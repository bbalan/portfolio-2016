/**
 * Configuration settings for Gulp.
 */
module.exports = {

    src: "./src/", // Source code root
    temp: "./build/temp/", // Temp files

    // Unique settings for each build environment (e.g. Amazon S3 paths)
    environments: {
        dev: {
            dest: "build/dev/"
        },
        test: {
            dest: "build/test/"     
        },
        prod: {
            dest: "build/prod/"
        }
    },

    // Binary assets (images, sounds, etc)
    assets: {
        src     : "assets/**/*",
        watch   : "assets/**/*",
        dest    : "assets",
    },

    extras: {
        src     : "extras/**/*",
        watch   : "extras/**/*",
        dest    : "extras",
    },

    // HTML markup
    markup: {
        basedir : "markup/",
        src     : "markup/**/!(_)*.jade", // ignore template files (_yourTemplate.jade)
        watch   : "markup/**/*.jade",
        dest    : "",
    },

    // Stylesheets
    styles: {
        src     : "styles/app.styl",
        watch   : "styles/**/*.styl",
        dest    : "styles",
    },

    // Javascript
    scripts: {
        src     : "scripts/App.js",
        libs    : "scripts/vendor/**/*.js",
        watch   : "scripts/**/*",
        file    : "app.js",
        dest    : "scripts/",
    }
}