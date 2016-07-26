var gulp        = require('gulp');
var debug       = require("gulp-debug");
var sourcemaps  = require('gulp-sourcemaps');

var source      = require('vinyl-source-stream');
var browserify  = require('browserify');
var tsify       = require('tsify');

var walkSync    = require('walk-sync');

var browserSync = require('browser-sync').create();
// var sass        = require('gulp-sass');

var ts	 	    = require('gulp-typescript');
var merge       = require('merge2');

var project     = ts.createProject("tsconfig.json");



// Static Server + watching scss/html files
gulp.task('serve', ['typescript'], function() {

    browserSync.init({
        server: "./"
    });

    // gulp.watch("./sass/*.scss", ['sass']).on('change', browserSync.reload);
    gulp.watch("./ts/*.ts", ['typescript']);
    // gulp.watch("./js/*.js").on('change', browserSync.reload);
    // gulp.watch("./*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
// gulp.task('sass', function() {
//     return gulp.src("./scss/*.scss")
//         .pipe(sass())
//         .pipe(gulp.dest("css"))
//         .pipe(browserSync.stream());
// });

gulp.task('typescript', function () {
    var bundler = browserify({
      debug: true
    }).add('ts/main.ts');

   walkSync('typings').forEach(function(file) {
    if (file.match(/\.d\.ts$/)) {
      bundler.add("typings/" + file);
    }
  });

  bundler.plugin('tsify');

  return bundler.bundle()
    .on('error', function (error) { console.error(error.toString()); })
    .pipe(source('main.js'))
    .pipe(gulp.dest('js'));
});

gulp.task('default', ['serve']);