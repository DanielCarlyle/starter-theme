var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;


var SOURCEPATHS = {
  sassSource : 'src/scss/*.scss',
}
var APPPATH ={
  root: 'dist/',
  css : 'dist/css',
  js: 'dist/js'
}

gulp.task('sass', function() {
   return gulp.src('SOURCEPATH.sassSource')
   .pipe(sass({outputStyle:'expanded'}).on('error', sass.logError))
   .pipe(gulp.dest('APPPATH.css'));
});

gulp.task('serve', ['sass'], function() {
  browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
    server: {
      baseDir : APPPATH.root
    }
  })
});

gulp.task('default', ['serve']);
