var express = require('express');
var router = express.Router();
var async = require("async");

var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');   //used for file path
var firebase = require('firebase');
var database = firebase.database();


var postsRef = firebase.database().ref('posts');
postsRef.on('value', function (snapshot) {
	var obj = snapshot.val();
	data.postList = [];
	for (var key in obj) {
		var mPost = obj[key];
		mPost.key = key.toString();
		//console.log(mPost);
		data.postList.push(mPost);
	};
});


var data = {
	title: 'Santa House',
	isLoggedIn: false,
	username: 'Dolphin Dreams',
	postList: [],
}
/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', data);
});

function isLoggedIn(req, res, next) {
	if (data.isLoggedIn) {
		return next();
	}
	// if they aren't redirect them to the home page
	res.redirect('/');
};

var responseData = {
	success: false,
	message: ''
};

router.post('/login', function (req, res, next) {
	var username = req.body.username;
	var password = req.body.password;

	if (username == 'admin' && password == 'password') {
		data.isLoggedIn = true;
		data.username = username;
		responseData = {
			success: true,
			message: 'Login success!'
		}
	} else {
		responseData = {
			success: false,
			message: 'Login fail!'
		}
	};
	res.json(responseData);
});

router.post('/add-post', function (req, res, next) {
	var fstream;
	// upload image to uploads folder
	var title = '', content = '', image = '';

	async.waterfall([
		function (next) {
			req.busboy.on('file', function (fieldname, file, filename) {
				fstream = fs.createWriteStream('./uploads/' + filename);
				file.pipe(fstream);
				fstream.on('close', function () {
					image = filename;
					next();
				});
			});
			req.busboy.on('field', function (fieldname, value) {
				switch (fieldname) {
					case 'title':
						title = value;
						break;
					case 'content':
						content = value;
						break;
				};
			});
		},
		function (next) {
			req.pipe(req.busboy);
			var postData = { title, content, image };
			//console.log(postData)
			firebase.database().ref('posts').push(postData);
			next();
		},
		function (next) {
			responseData = {
				success: true,
				message: 'Successful!'
			};
			res.json(responseData);
		}
	], function (error) {
		if (error) {
			console.log(error);
		}
	});

});

router.get('/logout', function (req, res) {
	data.isLoggedIn = false;
	data.username = 'Dolphin Dreams';
	res.redirect('/');
});

router.get('/error', function (req, res) {
	res.render('index', data);
});

router.get('/posts/:key', function (req, res) {
	//console.log('posts/' + req.params.key);
	var postData = {};
	var postRef = firebase.database().ref('posts/' + req.params.key);
	postRef.once('value', function (snapshot) {
		postData = snapshot.val();	
		//console.log(post);		
	});
	res.render('post', postData);
});

router.get('/del/:key', function (req, res) {
	var filename = '';
	async.waterfall([
		function (next) {
			var postRef = firebase.database().ref('posts/' + req.params.key);
			postRef.once('value', function (snapshot) {
				filename = snapshot.val();
				//console.log(filename);
			});
			postRef.remove();
			next();
		},
		function (next) {
			var filePath = './uploads/' + filename.image;
			fs.unlinkSync(filePath);
			next();
		},
		function (next) {
			res.redirect('/', data);
		}
	], function (err) {
		if (err)
			console.log(err);
	});
});


module.exports = router;
