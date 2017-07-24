var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var firebase = require("firebase");

// Initialize Firebase
var config = {
	apiKey: "AIzaSyBu6CVbKxlQ7WylWt06DtZGLk_bpoh00ug",
	authDomain: "anlt-nodejs.firebaseapp.com",
	databaseURL: "https://anlt-nodejs.firebaseio.com",
	projectId: "anlt-nodejs",
	storageBucket: "anlt-nodejs.appspot.com",
	messagingSenderId: "919270542081"
};
firebase.initializeApp(config);

var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser({ keepExtensions: true, uploadDir: "uploads" }));

app.use(busboy({immediate:true}));
app.use(express.static(path.join(__dirname, 'public')));
// using materializer
app.use('/js', express.static(__dirname + '/node_modules/materialize-css/dist/js')); // redirect materializer JS
app.use('/js', express.static(__dirname + '/node_modules/materialize-css/js')); // redirect JS jQuery dir
app.use('/css', express.static(__dirname + '/node_modules/materialize-css/dist/css')); // redirect CSS dir
// redirect jquery
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
// redirect uploads folder
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.redirect('/error');
});


module.exports = app;
