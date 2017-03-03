// 引入插件
var gulp = require('gulp');
var gulpObj = {};
gulpObj.clean = require('gulp-clean');
gulpObj.cssmin = require('gulp-minify-css');
gulpObj.htmlmin = require('gulp-htmlmin');
gulpObj.imagemin = require('gulp-imagemin');
gulpObj.uglify = require('gulp-uglify');
gulpObj.assetRev = require('gulp-asset-rev'); // 增加版本号

// 具体方法
// 清理文件
gulp.task("clean", function() {
	return gulp.src('./publish')
	.pipe(gulpObj.clean());
})

// 压缩css
gulp.task('css', function() {
	return gulp.src('./css/**/*.css')
	.pipe(gulpObj.assetRev())
	.pipe(gulpObj.cssmin())
	.pipe(gulp.dest('./publish/css'));
})

// 压缩html
gulp.task('html', function() {
	var options = {
		removeComments: true, // 清除HTML注释
		collapseWhitespace: true, // 压缩HTML
		collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> ==> <input />
		removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
		removeScriptTypeAttributes: true, // 删除<script>的type="text/javascript"
		removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
		minifyJS: true, // 压缩页面JS
		minifyCSS: true // 压缩页面CSS
	};
	return gulp.src(['./**/*.html', '!./node_modules'])
	.pipe(gulpObj.assetRev())
	.pipe(gulpObj.htmlmin(options))
	.pipe(gulp.dest('./publish'));
})

// 压缩图片
gulp.task('image', function() {
	return gulp.src('./img/**/*.{png,jpg,gif,ico}')
	.pipe(gulpObj.assetRev())
	.pipe(gulpObj.imagemin())
	.pipe(gulp.dest('./publish/img'));
})

// 压缩js
gulp.task('js', function() {
	return gulp.src('./js/**/*.js')
	.pipe(gulpObj.assetRev())
	.pipe(gulpObj.uglify())
	.pipe(gulp.dest('./publish/js'));
})

gulp.task('default', ['clean'], function() {
	gulp.run('css', 'html', 'image', 'js');

	// gulp.watch('./css/**/*.css', function() {
	// 	gulp.run('css');
	// })
	// gulp.watch('./*.html', function() {
	// 	gulp.run('html');
	// })
	// gulp.watch('./js/**/*.js', function() {
	// 	gulp.run('js');
	// })
})