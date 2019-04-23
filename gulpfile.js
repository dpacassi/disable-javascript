'use strict';

// Gulp packages.
const gulp = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const plumber = require("gulp-plumber");
const del = require('del');
const rename = require('gulp-rename');
const sassGlob = require('gulp-sass-glob');

// Path settings.
let paths = {
  sass: './pages/src/sass',
  css: './pages/dist/css',
  js_src: './pages/src/js',
  js_dist: './pages/dist/js'
};

// SASS settings.
let options = {
  sass: {
    outputStyle: 'compressed'
  },
  uglify: {
    output: {
      quote_style: 1
    }
  }
};

//--------------- Cleaning functions.

function cleanCSS() {
  return del([
    paths.css + '/*'
  ]);
}

function cleanJS() {
  return del([
    paths.js_dist + '/*'
  ]);
}

function clean() {
  cleanCSS();
  cleanJS();
}

//--------------- Compiling functions.

function compileCSS() {
  return gulp
    .src(paths.sass + '/**/*.scss')
    .pipe(sassGlob())
    .pipe(plumber())
    .pipe(sass(options.sass))
    .pipe(gulp.dest(paths.css));
}

function compileJS() {
  return gulp
    .src(paths.js_src + '/*.js')
    .pipe(plumber())
    .pipe(uglify(options.uglify))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.js_dist));
}

function compile() {
  compileCSS();
  compileJS();
}

//--------------- Watcher.

function watch() {
  gulp.watch(paths.sass + '/**/*.scss', compileCSS);
  gulp.watch(paths.js_src + '/**/*.js', compileJS);
}

//--------------- Default function.

function defaultTask() {
  clean();
  compile();
  watch();
}

exports.cleanCSS = cleanCSS;
exports.cleanJS = cleanJS;
exports.clean = clean;
exports.compileCSS = compileCSS;
exports.compileJS = compileJS;
exports.compile = compile;
exports.watch = watch;
exports.default = defaultTask;
