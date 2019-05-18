// Required Plugins
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    browserSync = require('browser-sync'),
    cache = require('gulp-cache'),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    del = require('del'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    reload = browserSync.reload,
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify');

// Set paths for each file type
var jsPaths = ['src/assets/js/**/*.js', 'src/assets/components/**/*.js'],
    sassPaths = ['src/assets/master.scss', 'src/assets/components/**/*.scss'],
    htmlPaths = ['src/*.html'],
    imgPaths = ['src/assets/img/**/*'],
    fontPath = 'src/assets/font/**/*';

// JS Task transpiles to es5, minimizes, renames, and creates a sourcemap
gulp.task('js', () => {
    return gulp.src(jsPaths)
        .pipe(plumber())
        // .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        // .pipe(concat('bundle.js'))
        // .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(reload({
            stream: true
        }));
});

// Sass Task autoprefixes, renames w/.min, minimizes
gulp.task('sass', () => {
    return gulp.src(sassPaths)
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(reload({
            stream: true
        }));
});

// Html Task minimizes html
gulp.task('html', () => {
    return gulp.src(htmlPaths)
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(reload({
            stream: true
        }));
});

// Img Task optimizes images and makes them progressive
gulp.task('img', () => {
    return gulp.src(imgPaths)
        .pipe(cache(imagemin({
            progressive: true
        })))
        .pipe(gulp.dest('dist/assets/img'))
        .pipe(reload({
            stream: true
        }));
});

// Font Task moves fonts to dist
gulp.task('font', () => {
    return gulp.src(fontPath)
        .pipe(gulp.dest('dist/assets/font'));
});

// Delete Task delets the dist folder
gulp.task('delete', () => {
    return del(['dist/assets/js/**/*.js',
        'dist/assets/css/*.css',
        'dist/**/*.html'
    ], {
        dryRun: true
    }).then(paths => {
        console.log('Files and folders that would be deleted:\n', paths.join('\n'));
    });
});

// Browser-Sync Task starts the browsersync server and servs from the dist folder
gulp.task('browser-sync', () => {
    return browserSync.init({
        server: {
            baseDir: './dist/'
        }
    });
});

// Live Task starts browsersync then watches scss, js, img, html, and font files
exports.live = gulp.series(
    'delete',
    gulp.parallel('sass', 'js', 'img', 'html', 'font'),
    'browser-sync',
    () => {
        gulp.watch(sassPaths, ['sass']);
        gulp.watch(jsPaths, ['js']);
        gulp.watch(imgPaths, ['img']);
        gulp.watch(htmlPaths, ['html']);
        gulp.watch(fontPath, ['font']);
    }
);

// Build Task deletes all files then runs all tasks except live
exports.build = gulp.series(
    'delete',
    gulp.parallel('sass', 'js', 'img', 'html', 'font')
);

// Default Task runs all tasks except live, img, and delete tasks
exports.default = gulp.series('sass', 'js', 'html', 'font');