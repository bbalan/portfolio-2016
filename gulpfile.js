/**
 * Generic Gulpfile for a static website project.
 * Author: Bogdan Balan
 * Version: 3.0.0
 * 
 * Features:
 * - Jade
 * - Stylus with autoprefixer
 * - System.js module loader
 * - Sourcemaps
 * - Image minification (use "gulp imagemin")
 * - Builds to multiple environments (use "gulp build --env dev --silent", "gulp build --env test", etc)
 * 
 * To enable sourcemaps, go to Chrome dev tools, Sources tab, right click in left pane, Add Folder to Workspace, and select the "src" directory for this project.
 */





/* === MODULES === */

    var gulp        = require('gulp')

    // gulp modules
    ,   gutil       = require('gulp-util')              // console log
    ,   watch       = require('gulp-watch')             // watch for changes
    ,   runSequence = require('run-sequence')           // run tasks in order
    ,   gulpif      = require('gulp-if')                // execute operations conditionally
    ,   connect     = require('gulp-connect')           // run local server
    ,   path        = require('path')                   // need path.resolve() for connect
    // ,   embedlr     = require("gulp-embedlr")           // embed livereload script without plugin
    ,   livereload  = require('gulp-livereload')        // livereload
    
    // javascript
    ,   sourcemaps  = require('gulp-sourcemaps')        // sourcemap compiled code
    ,   stylus      = require('gulp-stylus')            // css preprocessor
    ,   autoprefix  = require('autoprefixer-stylus')    // cross-browser extensions for stylus
    ,   minifyCSS   = require('gulp-minify-css')        // minify css
    ,   cmq         = require('gulp-combine-mq')        // use media query selectors as children, not parents
    
    // configuration
    ,   args        = require('yargs').argv             // command line arguments (e.g. "gulp build --env dev")
    ,   config      = require('./gulp-config.js')       // settings and build paths
    ,   env         = 'dev'                             // environment to build for (e.g. dev, test, prod)
    ,   log         = true                              // whether to call gutil.log()
    ;





/* === UTILS === */

    // Split error messages into readable lines.
    function handleError(e) {
        var message = e.message.split('\n');
        
        for(var line in message) gutil.log(message[line]);
        
        gutil.log(e.stack);
        gutil.beep();
    }

    //Set the active environment using command line args (e.g. "gulp --env dev")
    function setEnv() {
        env = !!args.env ? args.env : env; // change default env if specified 
        gutil.log('Building - environment:', gutil.colors.yellow(env) );
    }

    // Set the active environment using command line args (e.g. "gulp --env dev")
    gulp.task('setEnv', setEnv);









/* === CSS === */

    // Preprocess stylesheets.
    gulp.task('styles', function() {

        var src  = config.src + config.styles.src,
            dest = config.environments[env].dest + config.styles.dest;

        log && gutil.log('Rebuilding stylesheets.');

        gulp.src(src)
            .pipe(gulpif(env == 'dev', sourcemaps.init()))
            .pipe(stylus({ 
                // use: [autoprefix('> 5%')], 
                // sourcemaps: true, 
                // sourcemap: {inline: true} 
            }))
            // .pipe(gulpif(env != 'dev', cmq({beautify:false})))
            // .pipe(gulpif(env != 'dev', minifyCSS()))
            .on('error', handleError)
            .pipe(gulpif(env == 'dev', sourcemaps.write('.')))
            .pipe(gulp.dest(dest))
            .pipe(livereload({quiet: true}));
    });





/* === BUILD TASKS === */

    // Watch for changes.
    gulp.task('watch', function() {

        log && gutil.log('Watching for changes.');

        livereload.listen();
        gulp.watch(config.src + config.styles.watch,  ['styles']  );
    });

    // Start the local server.
    gulp.task('connect', function() {
        connect.server({
            root: config.environments[env].dest,
            // livereload: true,
            port: 9000,
            fallback: config.environments[env].dest + 'index.html'
        });
    });

    // Configure settings, copy assets and run preprocessors.
    gulp.task('build', function() {
        runSequence([ 'setEnv', 'styles', ]);
        
    });

    // Build, start server and watch for changes.
    gulp.task('default', function() {
        runSequence([ 'build', 'connect', 'watch' ]);
    });
