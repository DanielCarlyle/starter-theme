var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('gulp-browserify');
var clean =require('gulp-clean');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');
var injectPartials = require('gulp-inject-partials');
var minify = require('gulp-minify');

var SOURCEPATHS = {
  sassSource : 'src/scss/*.scss',
  htmlSource : 'src/*html',
  htmlPartialSource : 'src/partial/*.html',
  jsSource : 'src/js/**',
  imgSource : 'src/img/**'
}
var APPPATH ={
  root: 'dist/',
  css : 'dist/css',
  js: 'dist/js',
  img: 'dist/img'
}

gulp.task('clean-html', function() {
  return gulp.src(APPPATH.root + '/*html', {read: false, force: true})
   .pipe(clean());
});

gulp.task('clean-scripts', function() {
  return gulp.src(APPPATH.js + '/*js', {read: false, force: true})
   .pipe(clean());
});

gulp.task('sass', function(){
  var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
  var sassFiles;

sassFiles = gulp.src(SOURCEPATHS.sassSource)
   .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
    }))
   .pipe(sass({outputStyle:'expanded'}).on('error', sass.logError))
   return merge(bootstrapCSS, sassFiles)
       .pipe(concat('app.css'))
       .pipe(gulp.dest(APPPATH.css));
});

gulp.task('images', function() {
  return gulp.src(SOURCEPATHS.imgSource)
    .pipe(newer(APPPATH.img))
    .pipe(imagemin())
    .pipe(gulp.dest(APPPATH.img));
});

gulp.task('scripts', ['clean-scripts'], function () {
  gulp.src(SOURCEPATHS.jsSource)
    .pipe(concat('main.js'))
    .pipe(browserify())
    .pipe(gulp.dest(APPPATH.js))
});

gulp.task('compress', function () {
  gulp.src(SOURCEPATHS.jsSource)
    .pipe(concat('main.js'))
    .pipe(browserify())
    .pipe(minify())
    .pipe(gulp.dest(APPPATH.js))
});

gulp.task('html', function() {
   return gulp.src(SOURCEPATHS.htmlSource)
        .pipe(injectPartials())
        .pipe(gulp.dest(APPPATH.root))
});

/*
gulp.task('copy', ['clean-html'], function() {
  gulp.src(SOURCEPATHS.htmlSource)
      .pipe(gulp.dest(APPPATH.root))
});

copy task also removed from the watch task below

*/

gulp.task('serve', ['sass'], function() {
  browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
    server: {
      baseDir : APPPATH.root
    }
  })
});

gulp.task('watch', ['serve', 'sass', 'clean-html', 'clean-scripts', 'scripts', 'images', 'html'], function() {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  //gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
   gulp.watch([SOURCEPATHS.htmlSource, SOURCEPATHS.htmlPartialSource], ['html', 'clean-html']);
});

gulp.task('default', ['watch']);
