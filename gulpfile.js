var gulp        = require('gulp');
var gutil       = require('gulp-util')
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var browserify  = require('browserify')
var source      = require('vinyl-source-stream')
var glob        = require('glob');
var ts	 	= require('gulp-typescript');



// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("./sass/*.scss", ['sass']).on('change', browserSync.reload);
    gulp.watch("./ts/*.ts", ['typescript']);
    gulp.watch("./js/*.js").on('change', browserSync.reload);
    gulp.watch("./*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("./scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("css"))
        .pipe(browserSync.stream());
});

gulp.task('typescript', function () {
	return gulp.src('./ts/*.ts')
		.pipe(ts({
			noImplicitAny: true,
			out: 'output.js'
		}))
		.pipe(gulp.dest('js/'));
});

gulp.task('default', ['serve']);
