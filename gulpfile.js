'use strict';

const gulp = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');
const mocha = require('gulp-mocha');
const typescript = require('typescript');

const tsProject = ts.createProject('tsconfig.json', {

});

gulp.task('default', ['test'], () => {
    gulp.watch('app/**/*.ts', ['test']);
});

gulp.task('test', ['build'], () =>
    gulp.src('build/**/*-spec.js')
        .pipe(mocha({
            reporter: 'nyan',
            clearRequireCache: true,
            ignoreLeaks: true
        }))
);

gulp.task('build', ['ts', 'lib', 'copyJs']);

gulp.task('ts', ['clean'], () =>
    gulp.src(['app/**/*.ts', 'typings/index.d.ts', "declarations/**/*.d.ts"])
        .pipe(ts(tsProject))
        .pipe(gulp.dest('build'))
);

gulp.task('lib', ['clean'], () =>
    gulp.src('./node_modules/requirejs/require.js')
        .pipe(gulp.dest('build/lib'))
);

gulp.task('copyJs', ['clean'], () =>
    gulp.src('app/**/*.js')
        .pipe(gulp.dest('build'))
);

gulp.task('clean', () => del('build/**/**'));
