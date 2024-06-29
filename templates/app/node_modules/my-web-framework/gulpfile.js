'use strict';

var gulp = require('gulp');
var lint = require('gulp-eslint');
var mocha = require('gulp-mocha');

var paths = ['*.js', 'test/*.js'];

gulp.task('lint', function() {
  return gulp.src(paths)
  .pipe(lint())
  .pipe(lint.format());
});

gulp.task('test', function() {
  return gulp.src(paths, {read: false})
		.pipe(mocha({reporter: 'nyan'}));
});
