var gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const autoprefixer = require('gulp-autoprefixer');

var SOURCEPATHS = {
  sassSource : 'src/scss/*.scss',
  htmlSource : 'src/*html'
}
var APPPATH ={
  root: 'dist/',
  css : 'dist/css',
  js: 'dist/js'
}

gulp.task('sass', function(){
   return gulp.src(SOURCEPATHS.sassSource)
   .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
    }))
   .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
   .pipe(gulp.dest(APPPATH.css));
});

gulp.task('copy', function() {
  gulp.src(SOURCEPATHS.htmlSource)
      .pipe(gulp.dest(APPPATH.root))
})

gulp.task('serve', ['sass'], function() {
  browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
    server: {
      baseDir : APPPATH.root
    }
  })
});

gulp.task('watch', ['serve', 'sass','copy'], function() {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
});

gulp.task('default', ['watch']);
