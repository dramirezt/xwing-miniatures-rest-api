var gulp   = require( 'gulp' );
var server = require( 'gulp-develop-server' );
var livereload = require( 'gulp-livereload' );
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var serverFiles = [
    './*.js',
    './models/*.js',
    './routes/*.js'
];

// Check all JS files and report errors
gulp.task('jshint', function() {
    return gulp.src(serverFiles)
            .pipe(jshint())
            .pipe(jshint.reporter(stylish));
});

// Clean
gulp.task('clean', function() {
    return del(['dist']);
});

// run server
gulp.task( 'server:start', function() {
    server.listen( { path: './server.js' } );
});

// If server scripts change, restart the server and then livereload.
gulp.task( 'default', [ 'server:start'], function() {
    function restart( file ) {
        server.changed( function( error ) {
            if( ! error ) livereload.changed( file.path );
        });
    }
    gulp.watch(serverFiles).on('change', restart);
});
