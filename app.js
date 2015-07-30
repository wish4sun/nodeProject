var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var realcom = require('./realcom_config');
var app = express();

app.set('views', path.join(__dirname, realcom.dir.views+realcom.version));
// use handlebars template
var hbs  = require('express-handlebars');
app.engine('html', hbs({
  layoutsDir: app.get('views')+"/layouts",
  partialsDir: app.get('views')+"/partials",
  defaultLayout: 'index',
  extname: '.html'
}));
//app.engine('.html', exphbs.__express);
// ejs view engine setup
//app.set('view engine', 'ejs');
app.set('view engine', 'html');

var routes = require(realcom.dir.routes+realcom.version+'/index');
var users = require(realcom.dir.routes+realcom.version+'/users');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, realcom.dir.public+realcom.version)));
//app.use('/websites',express.static(path.join(__dirname, realcom.dir.websites)));
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      layout: false,
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    layout: false,
    message: err.message,
    error: {}
  });
});


module.exports = app;