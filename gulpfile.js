const gulp = require('gulp');
const sass = require('gulp-sass');
const autoPrefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create()
const deporder = require('gulp-deporder');
const minify = require('gulp-minify');
const babel = require('gulp-babel');

const path = "./assets";

gulp.task('css', () => {
    return gulp.src('./assets/sass/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoPrefixer())
        .pipe(cleanCSS())
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest(`${path}/css`))
        .pipe(browserSync.stream());
});

gulp.task('js', () => {
    return gulp.src('./assets/scripts/*.js')
        .pipe(deporder())
        .pipe(concat('main.min.js'))
        .pipe(minify({
            ext: {
                src: '-debug.js',
                min: '.js'
            }
        }))
        .pipe(gulp.dest(`${path}/js`))
})
gulp.task('serve', ['css', 'js'], () => {
    browserSync.init({
        server: path
    })

    gulp.watch(`${path}/sass/*.scss`, ['css']).on('change', browserSync.reload);
    gulp.watch(`${path}/scripts/*.js`, ['js']).on('change', browserSync.reload);
    gulp.watch(`${path}/*.html`).on('change', browserSync.reload);
});

gulp.task('default', ['serve'])