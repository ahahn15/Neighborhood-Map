var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var cleanCSS = require('gulp-clean-css');
var htmlminify = require("gulp-html-minify");

gulp.task('minify-css', function() {
   return gulp.src('src/css/*.css')
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(gulp.dest('dist/css'));
});

// gulp-uglify is not compatible with ES6
gulp.task('compress', function () {
   pump([
      gulp.src('src/js/*.js'),
      uglify(),
      gulp.dest('dist/js')
   ]
   );
});

// just move the js files to dist for now
gulp.task('move-js', [], function() {
  gulp.src('src/js/*.js')
      .pipe(gulp.dest('dist/js'));
});

// move bower components
gulp.task('move-knockout', [], function() {
  gulp.src('src/bower_components/knockout/**/**.*')
      .pipe(gulp.dest('dist/bower_components/knockout'));
});

gulp.task('build-html', function(){
   return gulp.src('src/*.html')
      .pipe(htmlminify())
      .pipe(gulp.dest('dist'))
});

gulp.task('default', [ 'build-html', 'minify-css', 'move-js', 'move-knockout' ]);