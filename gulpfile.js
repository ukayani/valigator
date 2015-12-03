'use strict';
// Tasks for Offer-API

let gulp = require('gulp');
let mocha = require('gulp-mocha');
let istanbul = require('gulp-istanbul');
let isparta = require('isparta');
let eslint = require('gulp-eslint');
let jscs = require('gulp-jscs');
let jsinspect = require('gulp-jsinspect');
let stylishJscs = require('jscs-stylish');
let checkDeps = require('gulp-check-deps');

let sourceFiles = ['lib/**/*.js'];
let testSourceFiles = ['test/**/**.spec.js'];
let allSourceFiles = sourceFiles.concat(testSourceFiles);

gulp.task('pre-test', function () {
  return gulp.src(sourceFiles)
    // Covering files
    .pipe(istanbul({
      instrumenter: isparta.Instrumenter,
      includeUntested: true
    }))
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {

  return gulp.src(testSourceFiles)
    .pipe(mocha())
    .pipe(istanbul.writeReports()) // Creating the reports after tests ran
    .pipe(istanbul.enforceThresholds({thresholds: {global: 70}}));

});

gulp.task('style', function () {
  return gulp.src(allSourceFiles)
    .pipe(jscs())
    .pipe(jscs.reporter(stylishJscs.path))
    .pipe(jscs.reporter('fail'));
});

gulp.task('lint', function () {
  return gulp.src(allSourceFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('no-copy-paste', function () {
  return gulp.src(allSourceFiles)
    .pipe(jsinspect({
      threshold: 35,
      identifiers: true,
      suppress: 0
    }));
});

gulp.task('check-deps', function () {
  return gulp.src('package.json').pipe(checkDeps());
});

gulp.task('check', ['lint', 'style', 'no-copy-paste', 'check-deps']);

gulp.task('default', ['test', 'check']);
