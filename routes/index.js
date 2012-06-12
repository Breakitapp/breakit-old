
/*
 * GET home page.
 */
var models = require('../model');
var async = require('async');
require('../models/PictureModel');



exports.index = function(req, res){
  // create a sync task for database related queries
  async.parallel([models.Picture.allSorted],
      function(err, results){
          if(err) {
              throw err;
          }
          res.render('index', { title: 'BreakIt', pictures: results[0] });
      });
};

exports.test = function(req, res){
		console.log(req.body);
		console.log(req.body.testkey);
		var location = new models.Location({longitude: 100, latitude: 125});
		
		console.log("type: "+ typeof(req.body.testkey));
		console.log("type2: "+ typeof(location));		
		console.log("type long: "+ typeof(location.longitude));				
		console.log("long: "+ (location.longitude));		
		
		var pictures = pictureModel.relSorted(location);
		
		res.render('index', { title: 'BreakIt', pictures: pictures });
	};

exports.index_post = function(req, res) {
    var points = parseInt(req.body.points);
    var pic = req.body._id;
    var score_ = 0;
    //console.log(pic, points);

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

exports.index_fbshare = function(req,res) {
  res.render('fbshare', {title: 'FBShare'});
};

exports.index_splashscreen = function(req,res) {
	res.render('splash_screen', {title: 'Home Screen'});
}
exports.popUp = function(req, res) {
    res.render('test', {title: 'Test'});
}
