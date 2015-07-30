var fs=require('fs');
var path=require('path');
var realcom = require('../realcom_config');

function getRegion(hostname){
	var reg = /\./;
	var hosts = hostname.split(reg);
	return hosts[0];
}

function getEnv(hostname){
	var reg = /\./;
	var hosts = hostname.split(reg);
	if (hosts[1] == 'real') {
		return 'prd';
	}
	return hosts[1];
}

function getData(region,path){
	var fileTruePath = __dirname+'/../'+realcom.dir.locales+realcom.version+"/"+region+"/"+path;
	var jsonObj=JSON.parse(fs.readFileSync(fileTruePath));
	return jsonObj;
}

function scanFolder(path){
    var fileList = [],
        folderList = [],
        walk = function(path, fileList, folderList){
            files = fs.readdirSync(path);
            files.forEach(function(item) {
                var tmpPath = path + '/' + item,
                    stats = fs.statSync(tmpPath);

                if (stats.isDirectory()) {  
                    walk(tmpPath, fileList, folderList); 
                    folderList.push(tmpPath); 
                } else {  
                    fileList.push(tmpPath); 
                }  
            });  
        };  
    walk(path, fileList, folderList);
    console.log('Scan directory:"' + path +'" successful!');
    return {
        'files': fileList,
        'folders': folderList
    }
}

function getWantedArr(data, excludeStr){
	var wantedArr = [];
	if (!excludeStr) return data;
	excludeStr.forEach(function(eStr){
		data.forEach(function(item){
			if (item.indexOf(eStr) >= 0){
				data.splice(data.indexOf(item), 1, 'removed_item');
			}
		});
	});
	data.forEach(function(item){
		if (item != 'removed_item') {
			wantedArr.push(item);
		}
	});
	return wantedArr;
}

function mkdirs(dirname, mode, callback){
	fs.exists(dirname, function (exists){
    	if(exists){
    		console.log(dirname + " already created!");
        	callback();
    	}else{
        	console.log(path.dirname(dirname));
        	mkdirs(path.dirname(dirname), mode, function (){
            	fs.mkdir(dirname, mode, callback);
        		console.log(dirname + " created!");
        	});
    	}
	});
}

function mkdirsSync(dirname, mode){
	console.log(dirname);
	if(fs.existsSync(dirname)){
		console.log(dirname + " already created!");
    	return true;
	}else{
    	if(mkdirsSync(path.dirname(dirname), mode)){
        	fs.mkdirSync(dirname, mode);
        	console.log(dirname + " created!");
        	return true;
    	}
	}
}

exports.getRegion = getRegion;
exports.getEnv = getEnv;
exports.getData = getData;
exports.scanFolder = scanFolder;
exports.getWantedArr = getWantedArr;
exports.mkdirs = mkdirs;
exports.mkdirsSync = mkdirsSync;
