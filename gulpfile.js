"use strict";
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const gulp = require('gulp');
const gutil = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const babelify = require('babelify');
const colors = require('colors');

gulp.task('default', () => {
	let buildPath;
	let destPath;

	buildPath = './client';
	destPath = './client/assets/js';

	// script
	return browserify('./client/app.js')
	.transform(babelify, {
		presets: ["es2015"]
	})
	.bundle()
	.pipe(source('app.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(`${destPath}`));
});