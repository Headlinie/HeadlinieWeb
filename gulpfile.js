var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('default', function() {
  throw new Error("There is no default task. Run ```make build``` to build latest")
});

var bowerPath = "bower_components/";

var applicationFiles = [
	bowerPath + "react/react.min.js",
	"src/app.js"
];

gulp.task('scripts-min', function() {
  return gulp.src(applicationFiles)
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('build/'));
});

gulp.task('build', ['scripts-min']);
