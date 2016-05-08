const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const filter = require('gulp-filter');
const del = require('del');
const merge = require('merge-stream');
const jsonminify = require('gulp-jsonminify');
const uglify = require('gulp-uglify');


gulp.task('default',['build'], function() {
    // place code for your default task here
});

gulp.task('build',['clean:build'], function() {
    console.log('build');
    const zipFilter = filter(['**/*', '!**/*.zip']);
    const minFilter = filter(['**/*.min.*','**/*.woff2']);

    var  mainStream = gulp.src(['src/**/*'], { base: "./src/" })
        .pipe(filter(['**/*','!**/*.json']))
        .pipe(filter(['**/*','!**/*.js']))
        .pipe(filter(['**/*','!src/lib/**/*','!src/lib']))

        //.pipe(stripJsonComments());
        //.pipe(zipFilter)
        //.pipe(filter(['src/**/*']))
        //.pipe(gulp.dest('build/'));

    var manifestStream = gulp.src(['src/**/*.json'], { base: "./src/" })
        .pipe(jsonminify());

    var libStream = gulp.src(['src/lib/**/*'], { base: "./src/" })
        .pipe(minFilter);

    var jsStream = gulp.src(['src/class/**/*.js','src/browser_action/**/*.js','src/bg/**/*.js'], { base: "./src/" })
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify().on('error', function(e){
            console.log(e);
        }))
        .pipe(sourcemaps.write('.'));
        //.pipe(zipFilter)
        //.pipe(gulp.dest('./build/lib/'));

    return merge([mainStream,libStream,manifestStream,jsStream])
        .pipe(zipFilter)
        .pipe(gulp.dest('build/'));
    //return gulp.src('./src/js/**/*.js')
     //   .pipe(gulp.dest('./dist/'));
});

gulp.task('clean:build', function () {
    return del([
        './build/**/*',
        //'dist/report.csv',
        // here we use a globbing pattern to match everything inside the `mobile` folder
        //'dist/mobile/**/*',
        // we don't want to clean this file though so we negate the pattern
        //'!dist/mobile/deploy.json'
    ]);
});