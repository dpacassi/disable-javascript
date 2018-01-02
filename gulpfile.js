'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var pump = require('pump');
var del = require('del');
var rename = require('gulp-rename');

// Path settings.
var paths = {
  sass: './options/src/sass',
  css: './options/dist/css',
  js_src: './options/src/js',
  js_dist: './options/dist/js'
};

var options = {
  sass: {
    outputStyle: 'compressed'
  },
  uglify: {
    output: {
      quote_style: 1
    }
  }
};

gulp.task('clean-css', function() {
  del.sync([paths.css + '/*']);
});

gulp.task('clean-js', function() {
  del.sync([paths.js_dist + '/*']);
});

gulp.task('clean', ['clean-css', 'clean-js']);

gulp.task('compile-css', ['clean-css'], function() {
  return gulp.src(paths.sass + '/**/*.scss')
    .pipe(sass(options.sass).on('error', sass.logError))
    .pipe(gulp.dest(paths.css));
});

gulp.task('compile-js', ['clean-js'], function(cb) {
  pump([
      gulp.src(paths.js_src + '/*.js'),
      rename({suffix: '.min'}),
      uglify(options.uglify),
      gulp.dest(paths.js_dist)
    ],
    cb
  );
});

gulp.task('compile', ['compile-css', 'compile-js']);

gulp.task('watch', function() {
  gulp.watch(paths.sass + '/**/*.scss', ['compile-css']);
  gulp.watch(paths.js_src + '/**/*.js', ['compile-js']);
});

gulp.task('default', ['compile', 'watch']);
