var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');

var http = require('http');
var fs = require('fs');
var path = require('path');
var realcom = require('./realcom_config');
var realCommonTools = require('./modules/realCommonTools');

var dataList = realCommonTools.getWantedArr( realCommonTools.scanFolder('locales/'+realcom.version+'/cn').files, [".DS_Store"]);
var reg_src_locales = new RegExp("locales/"+realcom.version+"/cn/");
var reg_locales = /^locales/;
var reg_extname = /\.json$/;
console.log(dataList);

gulp.task('publish_cn', ['clean_cn','image_cn','css_cn','js_cn'], function() {
	dataList.forEach(function(item){
		var srcPage = item.replace(reg_src_locales, realcom.dev_host.cn+'/');
		srcPage = srcPage.replace(reg_extname, '');
		srcPages = srcPage.split('/');
		if (srcPages[srcPages.length-1] == 'index')
			srcPage = srcPage.replace('index', '');
		var distPage = item.replace(reg_locales, 'websites');
		distPage = distPage.replace(reg_extname, '.html');
		distPage = __dirname +"/"+ distPage;
		// console.log('srcPage----> '+srcPage);
		// console.log('distPage----> '+distPage);
		// console.log('distPage Path----> '+path.dirname(distPage));
		if(!fs.existsSync(path.dirname(distPage))){
			realCommonTools.mkdirsSync(path.dirname(distPage), '0755');
		}else{
			console.log(path.dirname(distPage)+' exists!');
		}

		http.get(srcPage+'?env=prd', function(res){
			var size = 0;
    		var chunks = [];
    		res.on('data', function(chunk){
      			size += chunk.length;
      			chunks.push(chunk);
  			});
  			res.on('end', function(){
				var data = Buffer.concat(chunks, size);
				fs.writeFileSync(distPage, data.toString());
				console.log(distPage + ' saved!');
				//console.log("distPage Path ---"+path.dirname(distPage));
				gulp.src(['./rev/*.json', distPage])
		        .pipe(revCollector({replaceReved: true}))
		        .pipe(gulp.dest(path.dirname(distPage)));
			});
		}).on('error', function(e) {
			console.log("Got error: " + e.message);
		});
	});
});

gulp.task('image_cn', ['clean_cn'], function () {  
    return gulp.src(['./public/'+realcom.version+'/images/*'])  
        .pipe(rev())
        .pipe(gulp.dest('./websites/'+realcom.version+'/cn/images'))
        .pipe(rev.manifest('img_cn.json'))
        .pipe(gulp.dest('./rev'));
});
gulp.task('css_cn', ['clean_cn'], function () {
    return gulp.src(['./public/'+realcom.version+'/stylesheets/*'])
    	//.pipe(concat('common.min.css'))
        .pipe(rev())
        .pipe(gulp.dest('./websites/'+realcom.version+'/cn/stylesheets'))
        .pipe(rev.manifest('css_cn.json'))
        .pipe(gulp.dest('./rev'));
        //.pipe(minifyCss());
});
gulp.task('js_cn', ['clean_cn'], function () {  
    return gulp.src(['./public/'+realcom.version+'/javascripts/*'])  
        .pipe(rev())
        .pipe(gulp.dest('./websites/'+realcom.version+'/cn/javascripts'))
        .pipe(rev.manifest('js_cn.json'))
        .pipe(gulp.dest('./rev'));
});

gulp.task('clean_cn', function() {
  return gulp.src(['./websites/'+realcom.version+'/cn/*'], {read: false})
    .pipe(clean({force: true}));
});


