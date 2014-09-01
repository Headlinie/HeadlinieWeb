var gulp = require('gulp');
var browserify = require('browserify');
var del = require('del');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

var paths = {
  // TODO migrate CSS to LESS
  //css: ['src/css/**/*.less'],
  app_js: ['./src/js/app.jsx'],
  js: ['src/js/*.js'],
};

gulp.task('clean', function(done) {
  del(['build'], done);
});


gulp.task('js', ['clean'], function() {
  browserify(paths.app_js)
    .transform(reactify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./src/'));
});

gulp.task('watch', function() {
  gulp.watch(paths.app_js, ['js']);
  gulp.watch(paths.js, ['js']);
});

gulp.task('default', ['watch', 'js']);

// TODO add task for building for production usage
// gulp.task('default', ['watch', 'js']);

// TODO add task for bumping version
// gulp.task('default', ['watch', 'js']);
