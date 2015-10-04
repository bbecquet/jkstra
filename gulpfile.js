var gulp = require('gulp'),
    concat = require('gulp-concat');

gulp.task('concat', function(){
  return gulp.src('src/**/*.js')
    .pipe(concat('jKstra.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['concat']);
