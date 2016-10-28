'use strict';

(function () {
    const gulp = require("gulp");
    const path = require('path');
    const cached = require("gulp-cached");
    const remember = require("gulp-remember");
    const less = require('gulp-less');
    const debug = require('gulp-debug');
    const sourcemaps = require('gulp-sourcemaps');
    const concat = require('gulp-concat');
    const useref = require('gulp-useref');
    const autoprefixer = require('gulp-autoprefixer');
    const gulpIf = require('gulp-if');
    const del = require('del');
    const newer = require('gulp-newer');
    const notify = require('gulp-notify');
    const watch = require('gulp-watch');
    const browserSync = require('browser-sync').create();
    const combine = require('stream-combiner2').obj;
    const rename = require('gulp-rename');
    const cleanCss = require('gulp-clean-css');
    const uglify = require('gulp-uglify');
    const pump = require('pump');
    const size = require('gulp-size');
    const imagemin = require('gulp-imagemin');
    const svgSprite = require('gulp-svg-sprite');
    const rewriteCSS = require('gulp-rewrite-css');
    const svgmin = require('gulp-svgmin');
    const svgstore = require('gulp-svgstore');
    const lessImport = require('gulp-less-import');
    const inject = require('gulp-inject');
    const cheerio = require('gulp-cheerio');
    const gutil = require('gulp-util');
    const ftp = require('vinyl-ftp');

    const isDev = true;

    gulp.task('ftp', function () {
        const conn = ftp.create({
            host: 'qqq',
            user: 'qqq',
            pass: 'qqq',
            parallel: 10,
            log: gutil.log
        });

        return gulp.src(['./build/**'], { buffer: false })
            .pipe(conn.newer('/public_html/folio'))
            .pipe(conn.dest('/public_html/folio'));
    });
    gulp.task("clean", function () {
        return del("build");
    });
    gulp.task("less", function () {
        return combine(
          gulp.src("source/less/**/*.less"),
          cached("css"),
          gulpIf(isDev, sourcemaps.init()),
          less({}),
          autoprefixer({ browsers: ['last 3 version', 'ie 9'] }),
          remember("css"),
          gulpIf(isDev, sourcemaps.write()),
          gulpIf(!isDev, cleanCss()),
          gulpIf(!isDev, rename('styles.min.css')),
          size({
              title: 'Размер-------------------',
              showFiles: true,
              showTotal: false
          }),
          gulp.dest('source/css')
        ).on('error', notify.onError(function (err) {
            return {
                title: '\n\nCSS ERROR in ' + err.lineNumber + ' line:\n\n',
                message: 'MESSAGE: ' + err.message
            };
        }));
    });
    gulp.task('svg', function () {
        var svgs = gulp.src('source/img/*.svg')
            .pipe(svgmin({
                plugins: [{
                    removeDoctype: true
                }, {
                    removeComments: true
                }, {
                    removeAttrs: { attrs: 'fill' }
                }, {
                    cleanupNumericValues: { floatPrecision: 2 }
                }, {
                    convertColors: {
                        names2hex: true,
                        rgb2hex: true
                    }
                }]
            }))
            .pipe(svgstore({
                inlineSvg: true
            }))
            .pipe(cheerio(function ($) {
                $('svg').attr('style', 'display:none');
            }))
            .pipe(size({
                title: '\nРАЗМЕР СПРАЙТА:',
                showFiles: true,
                showTotal: false
            }))
        //.pipe(gulp.dest('source/img/sprites'))
        ;

        function fileContents(filePath, file) {
            return file.contents.toString();
        }
        //нужно добавить в html: <!-- inject:svg --><!-- endinject -->
        return gulp
            .src('source/index.html')
            .pipe(inject(svgs, { transform: fileContents }))
            .pipe(gulp.dest('source'));
    });
    gulp.task("html", function () {
        return gulp.src(["source/*.html", 'source/html/**/*.*'], { since: gulp.lastRun("html") })
          .pipe(newer("build"))
          .pipe(size({
              title: 'Размер-------------------:',
              showFiles: true,
              showTotal: false
          }))
          .pipe(gulp.dest("build"));
    });
    gulp.task("css", function () {
        return gulp.src(['source/css/**/*.*'], { since: gulp.lastRun("css") })
            .pipe(newer("build/css"))
            .pipe(gulpIf(true, sourcemaps.write()))
            .pipe(gulpIf(true, cleanCss()))
            //.pipe(gulpIf(true, rename('styles.min.css')))
            .pipe(size({
                title: 'Размер-------------------:',
                showFiles: true,
                showTotal: false
            }))
            .pipe(gulp.dest("build/css"));
    });
    gulp.task("js", gulp.series(
    function () {
        return gulp.src(['source/js/**/*.*'], { since: gulp.lastRun("js") })
            .pipe(newer("build/js"))
            .pipe(size({
                title: 'Размер-------------------:',
                showFiles: true,
                showTotal: false
            }))
            .pipe(gulp.dest("build/js"));
        },
        function (cb) {
            pump([
                  gulp.src('build/js/*.js'),
                  uglify(),
                  gulp.dest('build/js')
            ], cb);
        }
    ));
    gulp.task('img', function () {
        return gulp.src('source/img/**/*.{png,jpg,gif,svg,ico}', { since: gulp.lastRun('img') })
          .pipe(newer('build/img'))
          .pipe(imagemin())
          .pipe(size({
              title: 'Размер-------------------',
              showFiles: true,
              showTotal: false
          }))
          .pipe(gulp.dest('build/img'));
    });
    gulp.task("vendors", function () {
        return gulp.src(['source/vendors/**/*.*'], { since: gulp.lastRun("vendors") })
          .pipe(newer("build/vendors"))
          .pipe(size({
              title: 'Размер-------------------:',
              showFiles: true,
              showTotal: false
          }))
          .pipe(gulp.dest("build/vendors"));
    });
    gulp.task('build', gulp.series('svg', gulp.parallel('html', 'css', 'js', 'img', 'vendors')));
    gulp.task('watch', function () {
        gulp.watch('source/less/*.less', gulp.series('less')).on('unlink', function (filepath) {
            remember.forget('rememberCacheName', path.resolve(filepath));
        });
        gulp.watch('source/img/*.svg', gulp.series('svg'));
    });
    gulp.task('serve', function () {
        browserSync.init({ server: 'source' });
        browserSync.watch('source/**/*.*').on('change', browserSync.reload);
    });
    gulp.task('dev', gulp.parallel('watch', 'serve'));
    gulp.task('default',
      gulp.series('dev')
    );

})();