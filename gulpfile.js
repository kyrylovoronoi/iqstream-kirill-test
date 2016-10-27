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
    //const googlecdn = require('gulp-google-cdn');
    //const wiredep = require('wiredep').stream;
    //const sftp = require('gulp-sftp');
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

    // Запуск в консоли: "NODE_ENV=production npm start [задача]" приведет к сборке без sourcemaps
    //const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'dev';
    const isDev = true;

    //gulp.task('bower', function () {
    //  gulp.src('./source/index.html')
    //    .pipe(wiredep({
    //      directory: "bower_components"
    //    }))
    //    .pipe(gulp.dest('./source'));
    //});

    gulp.task('ftp', function () {
        const conn = ftp.create({
            host: '31.170.164.95',
            user: 'u364506786',
            pass: 'Qo7869pm',
            parallel: 10,
            log: gutil.log
        });

        //var globs = [
        //    'src/**',
        //    'css/**',
        //    'js/**',
        //    'fonts/**',
        //    'index.html'
        //];
        // using base = '.' will transfer everything to /public_html correctly
        // turn off buffering in gulp.src for best performance
        //return gulp.src(globs, { base: '.', buffer: false })
        //    .pipe(conn.newer('/public_html')) // only upload newer files
        //    .pipe(conn.dest('/public_html'));

        return gulp.src(['./build/**'], { buffer: false })
            .pipe(conn.newer('/public_html/folio')) // only upload newer files
            .pipe(conn.dest('/public_html/folio'));
    });

    //gulp.task('sftp', function () {
    //    return gulp.src('build/*')
    //      .pipe(sftp({
    //          host: '31.170.164.95',
    //          user: 'u364506786',
    //          pass: 'Qo7869pm',
    //          port: '21',
    //          remotePath: '/public_html/',
    //          timeout: 10000
    //      }));
    //});

    //удаление всех файлов
    gulp.task("clean", function () {
        return del("build");
    });

    // gulp.task("less", function () {
    //   return gulp.src("source/less/**/styles.less")
    //     //.pipe(debug({title:"SRC"}))
    //     //перезаписывает файл даже если изменений небыло
    //     .pipe(cached("css")) 
    //     //.pipe(debug({title:"CACHED"}))
    //     .pipe(gulpIf(isDev, sourcemaps.init()))
    //     //.pipe(debug({title:"SOURCEMAP_INIT"}))
    //     .pipe(less({
    //                  //import: process.cwd() + 'source/img/sprite',
    //                  //paths: [ path.join('source/img/tmp', 'source/less') ]
    //              }))
    //     .on('error', notify.onError())
    //     //.pipe(debug({title:"LESS"}))
    //     .pipe(autoprefixer({browsers: ['last 3 version']}))
    //     //.pipe(debug({title:"AUTOPREFIXER"}))
    //     .pipe(remember("css"))
    //     //.pipe(debug({title:"REMEMBER"}))
    //     .pipe(gulpIf(isDev, sourcemaps.write()))
    //     //.pipe(debug({title:"SOURCEMAP_WRITE"}))
    //     .pipe(gulpIf(!isDev, cleanCss()))
    //     .pipe(gulpIf(!isDev, rename('styles.min.css')))
    //     .pipe(gulp.dest("build/css"))
    //     //.pipe(debug({title:"END-CSS"}));
    //  });

    gulp.task("less", function () {
        return combine(
          gulp.src("source/less/**/*.less"),
          //debug({title:"***src***"}),
          //rewriteCSS({destination: 'build/css'}),
          cached("css"),
          //debug({title:"***cached***"}),
          gulpIf(isDev, sourcemaps.init()),
          less({}),
          autoprefixer({ browsers: ['last 3 version', 'ie 9'] }),
          remember("css"),
          //debug({title:"***remember***"}),
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

    //gulp.task('svg_sprite', function () {
    //    return gulp.src('source/img/*.svg')
    //      .pipe(svgSprite({
    //          mode: {
    //              css: {
    //                  dest: '.',
    //                  bust: false, //нужно для продашна - хеш в конце имен файлов!!!
    //                  sprite: 'sprite.svg',
    //                  layout: 'vertical',
    //                  //prefix: '$--',
    //                  dimensions: true,
    //                  render: {
    //                      less: {
    //                          dest: 'sprite.less'
    //                      }
    //                  }
    //              }
    //          }
    //      }))
    //      .pipe(imagemin())
    //      .pipe(size({
    //          title: 'Размер-------------------',
    //          showFiles: true,
    //          showTotal: false
    //      }))
    //      //.pipe(gulpIf('*.less', gulp.dest('source/less'), gulp.dest('source/img/sprites')));
    //      .pipe(gulp.dest('source/img/sprites'));
    //});

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
            //.pipe(rename({
            //    prefix: 'icon-'
            //}))
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
          //.pipe(debug({title:"SRC"}))
          .pipe(newer("build"))
          //.pipe(debug({title:"HTML"}))
          //.pipe(googlecdn(require('./bower.json'), {componentsPath: './bower_components/'}))
          //.pipe(debug({title:"GOOGLE-CDN"}))
          //.pipe(useref())  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          //добавить в html: <!-- build:css css/combined.css --><!-- endbuild -->
          //.pipe(!gulpIf('*.css', cleanCss()))
          //добавить в html: <!-- build:js scripts/combined.js --><!-- endbuild -->
          //.pipe(!gulpIf('*.js', uglify()))
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



    //gulp.task('build', gulp.series('clean', 'svg', gulp.parallel('html', 'css', 'js', 'img', 'vendors')));
    gulp.task('build', gulp.series('svg', gulp.parallel('html', 'css', 'js', 'img', 'vendors')));

    // Слежение изменений
    gulp.task('watch', function () {
        gulp.watch('source/less/*.less', gulp.series('less')).on('unlink', function (filepath) {
            //обработчик для того чтобы забыть cach файла если тот был удален
            remember.forget('rememberCacheName', path.resolve(filepath));
        });
        gulp.watch('source/img/*.svg', gulp.series('svg'));
        // gulp.watch('source/**/*.html', gulp.series('html'));
        // gulp.watch('bower.json', gulp.series('bower'));
        // gulp.watch('source/img/*.{png,jpg,gif}', gulp.series('img'));
    });

    // Локальный сервер для слежения изменений
    gulp.task('serve', function () {
        browserSync.init({ server: 'source' });
        browserSync.watch('source/**/*.*').on('change', browserSync.reload);
    });


    // gulp.task('qwe', gulp.series('build', gulp.parallel('watch', 'serve')));
    gulp.task('dev', gulp.parallel('watch', 'serve'));

    //по умолчанию
    gulp.task('default',
      gulp.series('dev')
    );

})();