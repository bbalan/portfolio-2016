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
    ,   replace     = require('gulp-replace')           // string replacement (for env paths in js and css)

    // dev helpers
    ,   connect     = require('gulp-connect')           // run local server
    ,   livereload  = require('gulp-livereload')        // livereload
    // ,   embedlr     = require("gulp-embedlr")           // embed livereload script without plugin
    ,   sourcemaps  = require('gulp-sourcemaps')        // sourcemap compiled code

    // assets
    ,   imagemin    = require('gulp-imagemin')          // crunch image assets
    ,   concat      = require('gulp-concat')            // concatenate files

    // markup
    ,   stripDebug  = require('gulp-strip-debug')       // remove console.log() from production build
    ,   jade        = require('gulp-jade')              // html preprocessor
    ,   minifyHtml  = require('gulp-minify-html')       // minify html
    
    // javascript
    ,   systemjs    = require('systemjs-builder')       // module loader
    ,   stripDebug  = require('gulp-strip-debug')       // remove console.log() from production build

    // styles
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





/* === ASSETS === */

    // Copy binary asset files (images, sounds, etc).
    gulp.task('assets', function() {

        var src = config.src + config.assets.src,
            dest = config.environments[env].dest + config.assets.dest;

        log && gutil.log('Copying binaries.');

        gulp.src(src)
            .pipe(gulp.dest(dest))
            .pipe(livereload({quiet: true}));
    });

    // Copy scripts, .htaccess and php files into the root directory
    gulp.task('extras', function() {

        var src = config.src + config.extras.src,
            dest = config.environments[env].dest + config.extras.dest;

        log && gutil.log('Copying extras.');

        gulp.src(src)
            .pipe(gulp.dest(dest))
            .pipe(livereload({quiet: true}));
    });

    // Minify images directly in dest directory. Designed to run separately from main tasks.
    gulp.task('imagemin', function() {

        setEnv(); // have to do this for all tasks that run independently

        var src  = config.environments[env].src + config.bin.src + '/**/*',
            dest = config.environments[env].dest + config.bin.dest;

        log && gutil.log('Compressing images.');

        gulp.src(src)
            .pipe(imagemin({
                optimizationLevel   : 3,
                multipass           : true
            }))
            .pipe(gulp.dest(dest));
    });





/* === HTML MARKUP === */

    // Preprocess Jade files.
    // Source file pattern is "html/**/!(_)*.jade", this
    // ignores files that start with an underscore, e.g. _template.jade
    // @TODO: livereloads before HTML processing is done
    gulp.task('markup', function() {

        var src  = config.src + config.markup.src,
            base = config.src + config.markup.basedir,
            dest = config.environments[env].dest + config.markup.dest;

        log && gutil.log('Rebuilding Jade.');

        gulp.src(src)
            .pipe(jade({basedir: base, pretty: true}).on('error', handleError))
            .pipe(gulpif(env != 'dev', minifyHtml({ empty: true })))
            .pipe(gulp.dest(dest))
            .pipe(livereload({quiet: true}));
    });





/* === CSS STYLES === */

    // Preprocess stylesheets.
    gulp.task('styles', function() {

        var src  = config.src + config.styles.src,
            dest = config.environments[env].dest + config.styles.dest;

        log && gutil.log('Rebuilding stylesheets.');

        gulp.src(src)
            .pipe(gulpif(env == 'dev', sourcemaps.init()))
            .pipe(stylus({ use: [autoprefix('> 5%')] }))
            .pipe(gulpif(env != 'dev', cmq({beautify:false})))
            .pipe(gulpif(env != 'dev', minifyCSS()))
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
        gulp.watch(config.src + config.assets.watch,  ['assets']  );
        gulp.watch(config.src + config.extras.watch,  ['extras']  );
        gulp.watch(config.src + config.markup.watch,  ['markup']  );
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
        runSequence([ 'setEnv', 'assets', 'extras', 'markup', 'styles' ]);
        
    });

    // Build, start server and watch for changes.
    gulp.task('default', function() {
        runSequence([ 'build', 'connect', 'watch' ]);
    });
