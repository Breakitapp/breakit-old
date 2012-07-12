/*****
 * Routes for BreakIt 0.0.2
 *
 * @type {*}
 */

//Module dependencies

var models = require('../model')
  , async = require('async')
  , picture = require('../models/PictureModel')
	, feedback = require('../models/FeedbackModel')
  , formidable = require('formidable')
  , format = require('util').format
  , fs = require('fs')
	,	url = require('url');

// Get homepage

exports.index = function(req, res){
	//renders the landing page. not the most elegant solution, propably needs refactoring
  res.render('landing', {req: req, title: 'Welcome to BreakIt'});
	
};

//Refresh homepage with the location of the viewer

exports.location_refresh = function(req, res){
	//console.log(req.originalUrl);

//	console.log(req.query);		
	
	var lon = req.query['lon'];
	var lat = req.query['lat'];
	var page = req.query['page'];

	//This finds the time. Is used to compare how long ago the picture has been posted
	var dt = new Date();
	var second = dt.getSeconds();
	var minute = dt.getMinutes();
	var hour = dt.getHours();
	var month = dt.getMonth()+1;
	var day = dt.getDate();
	var year = dt.getFullYear();
	var date = year + '/' + month + '/' + day + ' : ' + hour + ':' + minute + ':' + second;

	//This is a crude logging mechanism, that writes the date and location of a viewer. is done only on the first load
	if(page == 0) {
		console.log(date + " : the location of the viewer " + lon +" longitude and " +  lat + " latitude");
	}
	page++;
	
	

  async.waterfall([function(callback) {
		var pictures = picture.relSorted(lon, lat, page, function(pics) {
			callback(null, pics);
		});
	},
		function(pics, callback) {
			for(var i = 0; i < pics.length; i++) {
				var picDate = new Date(pics[i].date);
				var timeSincePic = dt - picDate;
				timeSincePic = Math.floor(timeSincePic/60000);
				if(timeSincePic >= 60) {
					timeSincePic = Math.floor(timeSincePic/60) + ' hours';
				} else if (10 < timeSincePic < 60) {
					timeSincePic = Math.floor(timeSincePic/5) + ' minutes';
				} else {
					timeSincePic += ' minutes';
				}
				pics[i].timeSince = timeSincePic;
			}
			callback(null, pics);
	}
	],
	function(err, result){
      if(err) {
          throw err;
      }
			if(page==1) {
      	res.render('index', {
					req: req, 
					title: 'BreakIT', 
					pictures: result, 
					lat: lat, 
					lon: lon,
					page: page, 
					show_comments : null});
			} else {
				res.render('index', {
					req :  req, 
					title: 'BreakIT', 
					pictures: result, 
					lat: lat, 
					lon: lon, 
					page: page,
					show_comments : null});
			}
  });
};

//Update the score of a pic after a post from front-end. Return the new score

exports.update_score = function(req, res) {
    var points = parseInt(req.body.points);
    var pic = req.body._id;
    var score_ = 0;

    models.Picture.update({_id: pic}, {$inc: {'points' : points}}, function(err, doc) {
        if(err) {
            throw err;
        }
				console.log("changed the score of "+pic+" with " + points);
    });
      
    models.Picture.find({'_id': pic}, {'points': 1}, function(err, score) {
        if(err) {
            throw err;
        }
        score_ = score[0].points;
        res.send({score: score_});
    });
};

//Splash screen routing.

exports.splash_screen = function(req,res) {
	res.render('splash_screen', {title: 'Home Screen'});
};

//Post to splas screen creates a new user with the email entered. The user is saved and a confirm is rendered

exports.splash_screen_post = function(req, res) {
	var email = req.body.email_field;
	var user = new models.User({email: email}) ;
	user.save(function(err) {
		if(err) throw err;
	});
	res.render('splash_screen_confirm', {title: 'Confirm'});
};

//Takes the uploaded picture, creates a new mongo-document based on it
//Saves the uploaded picture with a name based on the mongoId of the pic
//TODO naming the picture seems a little spaggethi, should be looked at

exports.upload = function(req, res) {
  var dt = new Date();
	var second = dt.getSeconds();
	var minute = dt.getMinutes();
	var hour = dt.getHours();
	var month = dt.getMonth()+1;
	var day = dt.getDate();
	var year = dt.getFullYear();
	var date = year + '/' + month + '/' + day + ' : ' + hour + ':' + minute + ':' + second;
	console.log(date + " : the user uploaded a picture, with the specs : ");
	console.log(req.body);
  
	var latitude = parseFloat(req.body.latitude);
	var longitude = parseFloat(req.body.longitude);
	 
	var picture = new models.Picture({
			//name: 'images/' + _id + '.jpeg', 
			headline: req.body.headline,
			loc: {lon: longitude, lat: latitude},
			location_name: req.body.location_name,
			story:req.body.story,
			user: req.body.user
			});
  //console.log(picture);
	picture.name = 'images/' + picture._id + '.jpeg';
	picture.save(function(err) {
		if(err) throw err;
	});
	
	var tmp_path = req.files.image.path;
  var target_path = './public/images/' + picture._id + '.jpeg';
	console.log(target_path);
  console.log(picture.name);
  fs.readFile(tmp_path, function(err, data) {
      if(err) throw err;
      fs.writeFile(target_path, data, function(err) {
          if(err) throw err;
          res.redirect('back');
      })
  });
};

//User registration routes

exports.registration = function(req, res) {
	res.render('registration', {title: 'Register a new BreakIt-user'});
}

exports.register_new = function(req, res) {
	console.log(req.body);
  var user = new models.User({
		fName		:		req.body.fName,
		lName		:		req.body.lName,
		nName		:		req.body.nName,
		email		:		req.body.email
  });
	user.save(function(err) {
		if(err) throw err;
	});
	res.send(user.fName + ': thank you for registering!');
  //res.redirect('back');
}

exports.picture = function(req, res) {
	res.render('upload');
}

//Feedback

exports.feedback = function(req, res) {
	console.log('user sent a feedback with :' + req.body);
	var fb = new models.Feedback({
		feedback : req.body.feedback
	});
  fb.save(function(err) {
		if(err) throw err;
	});
	res.send('thank you for your feedback');
}

//for testing

exports.test = function(req, res) {
	console.log(req.query['lon'], req.query['lat']);
	res.render('upload')
}

// Get a post
exports.get_post = function(req, res) {
	async.series([
		function(callback) {
			models.Picture.findById(req.params.id, function(err, pic){
				if(err) throw err;
				callback(null, pic);
			});
		}
	],
		function(err, results) {
			res.render('post', {picture : results[0], show_comments : 1});
		}
	);
}

exports.comment = function(req,res) {
	console.log(req.body);
	async.series([
		function(callback) {
			var comment = new models.Comment({comment : req.body.comment})
			comment.save(function(err) {
				if(err) throw err;
			});
			callback(null, comment);
		},
		function(callback) {
			models.Picture.findById(req.body.pic_id, function(err, pic){
				if(err) throw err;
				callback(null, pic);
			});
		}
	],
		function(err, results) {
			results[1].comments.push(results[0]);
			results[1].save(function(err) {
				if(err) throw err;
			});
			console.log(results[1]);
			//res.send('a new comment added ' + results[0]);
			res.redirect('back');
		}
	);
} 

exports.show_feedbacks = function(req, res) {
	console.log('rendering feedbacks');
	async.series([
		function(callback) {
			var fbs;
			models.Feedback.allSorted(function(err, results) {
				if(err) throw err;
				callback(null, results);
			});
		}],
		function(err, results) {
			console.log('rendering feedbacks');
			if(err) throw err;
			res.render('feedback', {feedbacks: results[0]});
		});
}
