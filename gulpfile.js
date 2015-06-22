var gulp = require('gulp');

var Path = require('path');
var compass = require('gulp-compass');
var minifyCss = require('gulp-minify-css');
var del = require('del');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var plumber = require('gulp-plumber');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var foreach = require('gulp-foreach');

var examples = [
  // "bike_rotating",
  "campudus_office_360"
];

gulp.task('sass', sassCompile);
gulp.task('assets', assetCopy);
gulp.task('scripts', scriptCompile);
gulp.task('clean', clean);

gulp.task('reloader', ['build'], reload);
gulp.task('dev', ['build'], server);

gulp.task('build', ['sass', 'assets', 'scripts']);
gulp.task('default', ['build']);


function sassCompile() {
  return gulp.src('src/main/examples/*')
    .pipe(foreach(function (stream, file) {
      var exampleName = file.path.replace(/.*src\/main\/examples\//, '');
      var outPath = 'out/examples/' + exampleName + '/css';
      return gulp.src(file.path + '/scss/style.scss')
        .pipe(plumber({
          errorHandler : function (error) {
            console.log(error.message);
            this.emit('end');
          }
        }))
        .pipe(compass({
          project : Path.join(__dirname),
          css : outPath,
          sass : 'src/main/examples/' + exampleName + '/scss',
          image : 'src/main/examples/' + exampleName + '/img'
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest(outPath));
    }))
}

function scriptCompile() {
  return gulp.src('src/main/examples/*')
    .pipe(foreach(function (stream, file) {
      return browserify()
        .add(file.path + '/js/app.js')
        .bundle()
        .on('error', function (err) {
          console.log('error', err);
          this.emit('end');
        })
        .pipe(source('app.js'))
        .pipe(gulp.dest('out/examples/' + file.path.replace(/.*src\/main\/examples/, '') + '/js'));
    }))
}

function assetCopy() {
  return gulp.src(['src/main/**', '!src/main/examples/**/js/**', '!src/main/**/scss', '!src/main/**/scss/**'])
    .pipe(gulp.dest('out/'));
}

function server() {
  browserSync({
    open : false,
    server : {
      baseDir : 'out'
    }
  });

  gulp.watch(['src/main/**', 'src/main/**/js/**', 'src/main/**/scss/**/*.scss'], {}, ['reloader']);

}

function clean(cb) {
  del(['out/'], cb);
}
