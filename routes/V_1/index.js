var express = require('express');
var router = express.Router();
var realcom = require('../../realcom_config');
var realCommonTools = require('../../modules/realCommonTools');

/* GET home page. */
router.get('/', function(req, res, next) {
	var region = realCommonTools.getRegion(req.hostname);
	var env = realCommonTools.getEnv(req.hostname);
	console.log(realcom['dev_host'][region]);
	if (req.query.env && req.query.env == 'prd') 
		env = 'prd';
	if (env == 'prd') {
		staticHost = realcom['cdn_host'][region];
	}else{
		staticHost = '';
	}
	console.log(staticHost);
	var dataFile = "index.json";
	var data = realCommonTools.getData(region, dataFile);
	res.render('index', {url: env, region: region, data: data, staticHost:staticHost});
});

/* GET Level 2 page. */
router.get('/:page', function(req, res, next) {
	var region = realCommonTools.getRegion(req.hostname);
	var env = realCommonTools.getEnv(req.hostname);
	console.log(realcom['dev_host'][region]);
	if (req.query.env && req.query.env == 'prd') 
		env = 'prd';
	if (env == 'prd') {
		staticHost = realcom['cdn_host'][region];
	}else{
		staticHost = '';
	}
	console.log(staticHost);
	var dataFile = req.params.page+".json";
	var data = realCommonTools.getData(region, dataFile);
	res.render('index', {layout: 'other', url: env, region: region, data: data, staticHost:staticHost});
});

/* GET Level 3 page. */
router.get('/:cat/:page', function(req, res, next) {
	var region = realCommonTools.getRegion(req.hostname);
	var env = realCommonTools.getEnv(req.hostname);
	console.log(realcom['dev_host'][region]);
	if (req.query.env && req.query.env == 'prd') 
		env = 'prd';
	if (env == 'prd') {
		staticHost = realcom['cdn_host'][region];
	}else{
		staticHost = '';
	}
	console.log(staticHost);
	var dataFile = req.params.cat+"/"+req.params.page+".json";
	var data = realCommonTools.getData(region, dataFile);
	res.render('index', {url: env, region: region, data: data, staticHost:staticHost});
});

/* GET Level 4 page. */
router.get('/:cat/:subcat/:page', function(req, res, next) {
	var region = realCommonTools.getRegion(req.hostname);
	var env = realCommonTools.getEnv(req.hostname);
	console.log(realcom['dev_host'][region]);
	if (req.query.env && req.query.env == 'prd') 
		env = 'prd';
	if (env == 'prd') {
		staticHost = realcom['cdn_host'][region];
	}else{
		staticHost = '';
	}
	console.log(staticHost);
	var dataFile = req.params.cat+"/"+req.params.subcat+"/"+req.params.page+".json";
	var data = realCommonTools.getData(region, dataFile);
	res.render('index', {url: env, region: region, data: data, staticHost:staticHost});
});
 
module.exports = router;
