'use strict';

/**
 * Imports and requires
 */

import del from 'del';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

// rename some plugins
const plugins = gulpLoadPlugins();

/**
 * Constants
 */

const PATH_ROOT = `${__dirname}/`,
      PATH_BUILD = `${PATH_ROOT}dist/`,
      PATH_SRC = `${PATH_ROOT}src/`;

/**
 * Prototype functions
 */

gulp.plumbedSrc = function () {
  return gulp.src.apply(gulp, Array.prototype.slice.call(arguments))
    .pipe(plugins.plumber({
      errorHandler: function (error) {
        console.error.bind(error);
        plugins.notify.onError({
            title: 'Gulp Error',
            message: 'Error: <%= error %>',
            sound: 'Bottle'
        })(error);
        this.emit('end');
      }
    }));
};

/**
 * Tasks
 */

gulp.task('build', ['copy'], () => {
  return gulp.plumbedSrc([
     `${PATH_SRC}**/*`
    ])
    .pipe(gulp.dest(PATH_BUILD));
});

gulp.task('clean', () => {
  return del([
      PATH_BUILD
    ]);
});

gulp.task('copy', ['copy:src', 'copy:src:minified']);

gulp.task('copy:src', ['clean'], () => {
  return gulp.plumbedSrc([
     `${PATH_SRC}**/*.js`
    ])
    .pipe(gulp.dest(PATH_BUILD));
});

gulp.task('copy:src:minified', ['clean'], () => {
  return gulp.plumbedSrc([
     `${PATH_SRC}**/*.js`
    ])
    .pipe(plugins.uglify({
      mangle: false
    }))
    .pipe(plugins.rename((path) => {
      path.basename = `${path.basename}.min`;
    }))
    .pipe(gulp.dest(PATH_BUILD));
});

gulp.task('default', ['build']);
