var gulp        = require('gulp');
var gutil       = require('gulp-util')
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var browserify  = require('browserify')
var source      = require('vinyl-source-stream')
var glob        = require('glob');


// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("./sass/*.scss", ['sass']).on('change', browserSync.reload);
    gulp.watch("./js/*.js").on('change', browserSync.reload);
    gulp.watch("./*.html").on('change', browserSync.reload);
});

// process JS files and return the stream.
// create a task that ensures the `js` task is complete before
// reloading browsers


// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("./scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("css"))
        .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);