const gulp = require('gulp');

// HTML
const fileInclude = require('gulp-file-include');
const htmlclean = require('gulp-htmlclean');
const htmlmin = require('gulp-htmlmin'); // Минификация HTML

// SASS
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso'); // Минификация CSS

const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const changed = require('gulp-changed');
const ghPages = require('gh-pages'); // Для деплоя на GitHub Pages

// Images
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');

// JavaScript
const uglify = require('gulp-uglify'); // Минификация JavaScript

gulp.task('clean:prod', function () {
	return gulp.src('./prod/', { read: false, allowEmpty: true })
		.pipe(clean({ force: true }));
});

const fileIncludeSetting = {
	prefix: '@@',
	basepath: '@file',
};

const plumberNotify = (title) => {
	return {
		errorHandler: notify.onError({
			title: title,
			message: 'Error <%= error.message %>',
			sound: true,
		}),
	};
};

gulp.task('html:prod', function () {
	return gulp
		.src(['./src/html/**/*.html', '!./src/html/components/**/*.html'])
		.pipe(changed('./prod/'))
		.pipe(plumber(plumberNotify('HTML')))
		.pipe(fileInclude(fileIncludeSetting))
		.pipe(htmlclean())
		.pipe(htmlmin({ collapseWhitespace: true })) // Минификация HTML
		.pipe(gulp.dest('./prod/'));
});

gulp.task('sass:prod', function () {
	return gulp
		.src(['./src/scss/*.scss', '!./src/scss/{reset,fonts,base}.scss'])
		.pipe(changed('./prod/css/'))
		.pipe(plumber(plumberNotify('SCSS')))
		.pipe(sourceMaps.init())
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(csso()) // Минификация CSS
		.pipe(sourceMaps.write())
		.pipe(gulp.dest('./prod/'));
});

gulp.task('images:prod', function () {
	return gulp
		.src('./src/img/**/*')
		.pipe(changed('./prod/img/'))
		.pipe(webp())
		.pipe(gulp.dest('./prod/img/'))
		.pipe(gulp.src('./src/img/**/*'))
		.pipe(changed('./prod/img/'))
		.pipe(imagemin({ verbose: true }))
		.pipe(gulp.dest('./prod/img/'));
});

gulp.task('fonts:prod', function () {
	return gulp
		.src('./src/fonts/**/*')
		.pipe(changed('./prod/fonts/'))
		.pipe(gulp.dest('./prod/fonts/'));
});

gulp.task('js:prod', function () {
	return gulp
		.src('./src/js/*.js')
		.pipe(changed('./prod/js/'))
		.pipe(plumber(plumberNotify('JS')))
		.pipe(babel())
		.pipe(webpack(require('./../webpack.config.js')))
		.pipe(uglify()) // Минификация JavaScript
		.pipe(gulp.dest('./prod/'));
});

// Задача для деплоя на GitHub Pages
gulp.task('deploy', function (done) {
	return ghPages.publish('prod', function () {
		done();
	});
});

// Основная задача для продакшена
gulp.task('prod', gulp.series(
	'clean:prod', 
	gulp.parallel('html:prod', 'sass:prod', 'images:prod', 'fonts:prod', 'js:prod'),
	'deploy' // Добавляем задачу деплоя в конец
));
