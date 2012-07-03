/*****
 * Routes for BreakIt 0.0.2
 *
 * @type {*}
 */

//Module dependencies

var models = require('../model')
  , async = require('async')
  , picture = require('../models/PictureModel')
  , formidable = require('formidable')
  , format = require('util').format
  , fs = require('fs');

// Get homepage

exports.index = function(req, res){
  // create a sync task for database related queries
	//TODO Should be thought of again, since now all pictures have only 1 point

  res.render('landing', {req: req, title: 'Welcome to BreakIt'});
	
  /*async.parallel([models.Picture.allSorted],
      function(err, results){
          if(err) {
              throw err;
          }
          res.render('index', { req: req, title: 'BreakIt', pictures: results[0] });
      });*/
};

//Refresh homepage with the location of the viewer

exports.location_refresh = function(req, res){
   // console.log(req.body);
    // THIS TEST KEY IS THE LOCATION OF BROWSER (USER AGENT = PHONE)
    // console.log('testkey:'+req.body.testkey);

    // CHANGE THE HARD CODED HELSINKI KEY TO USE CURRENT LOCATION OF THE BROWSER
    // AFTER THE LOCATION LOGIC IS ACCURATE USING HELSINKI AND TURKU TEST CASES
		// TODO THIS IS WRONG AND TOO COMPLICATED, SHOULD BE CHANGED
	var dt = new Date();
	var second = dt.getSeconds();
	var minute = dt.getMinutes();
	var hour = dt.getHours();
	var month = dt.getMonth()+1;
	var day = dt.getDate();
	var year = dt.getFullYear();
	var date = year + '/' + month + '/' + day + ' : ' + hour + ':' + minute + ':' + second;
  var lat = req.body.lat;
	var lon = req.body.lon
	console.log(date + " : the location of the viewer " + lat +" latitude and " +  lon + " longitude");
  async.parallel([function(callback) {
		var pictures = picture.relSorted(lon, lat, function(pics) {
			callback(null, pics);
		});
	}],
	function(err, results){
      if(err) {
          throw err;
      }
      res.render('index', {req: req, title: 'BreakIT', pictures: results[0] });
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
			latitude : req.body.latitude,
			longitude: req.body.longitude,
			location_name: req.body.location_name,
			story:req.body.story
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
