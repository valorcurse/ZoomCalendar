var gulp        = require('gulp');
var debug       = require("gulp-debug");
var sourcemaps  = require('gulp-sourcemaps');

var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var browserify  = require('browserify');
var tsify       = require('tsify');

var walkSync    = require('walk-sync');

var browserSync = require('browser-sync').create();
// var sass        = require('gulp-sass');

var ts	 	    = require('gulp-typescript');
var tsProject   = ts.createProject("tsconfig.json");



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


gulp.task("typescript", function() {
    return gulp.src([
            "ts/**.ts",
            "typings/index.d.ts"
        ])
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest("js/"));
});

gulp.task("bundle", ['typescript'], function() {

    var libraryName = "ZoomCalendar";
    var mainTsFilePath = "js/tmp/main.js";
    var outputFolder   = "js/";
    var outputFileName = libraryName + ".min.js";

    var bundler = browserify({
        debug: true,
        standalone : libraryName
    });

    return bundler.add(mainTsFilePath)
        .plugin("tsify")
        .transform("babelify", {extensions: [".js",".ts"]})
        .bundle(function(err, buf) { if (err != 'undefined') console.log(err.stack) })
        .pipe(source(outputFileName))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(outputFolder));
});

gulp.task('default', ['bundle']);