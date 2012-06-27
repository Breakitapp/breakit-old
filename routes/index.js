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
  async.parallel([models.Picture.allSorted],
      function(err, results){
          if(err) {
              throw err;
          }
          res.render('index', { req: req, title: 'BreakIt', pictures: results[0] });
      });
};

//Refresh homepage with the location of the viewer

exports.location_refresh = function(req, res){
   // console.log(req.body);
    // THIS TEST KEY IS THE LOCATION OF BROWSER (USER AGENT = PHONE)
    // console.log('testkey:'+req.body.testkey);

    // CHANGE THE HARD CODED HELSINKI KEY TO USE CURRENT LOCATION OF THE BROWSER
    // AFTER THE LOCATION LOGIC IS ACCURATE USING HELSINKI AND TURKU TEST CASES
		// TODO THIS IS WRONG AND TOO COMPLICATED, SHOULD BE CHANGED
    var lat = req.body.lat;
		var lon = req.body.lon
		console.log("the location of the viewer " + lat +" latitude and " +  lon + " longitude");
    async.parallel([function(callback) {
			var pictures = picture.relSorted(lon, lat, function(pics) {
				callback(null, pics);
			});
		}],
		function(err, results){
        if(err) {
            throw err;
        }
        res.render('newsFeed', {req: req, pictures: results[0] });
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

//A route waiting for the implementation of picture posting.

exports.upload = function(req, res) {
	console.log("the user uploaded a picture, with the specs : " + req.body);
    var tmp_path = req.files.image.path;
    var target_path = './public/images/' + req.files.image.name + '.jpeg';
    fs.readFile(tmp_path, function(err, data) {
        if(err) throw err;
        fs.writeFile(target_path, data, function(err) {
            if(err) throw err;
            res.redirect('back');
        })
    });
	var latitude = parseFloat(req.body.latitude);
	var longitude = parseFloat(req.body.longitude);
	var picture = new models.Picture({
			name: 'images/' + req.files.image.name + '.jpeg', 
			headline: req.body.headline, 
			latitude : req.body.latitude,
			longitude: req.body.longitude,
			location_name: req.body.location_name});
	picture.save(function(err) {
		if(err) throw err;
	});
};

//For testing the upload functionality

exports.picture = function(req, res) {
    res.render('upload', {title: 'uploadtest'});
};
