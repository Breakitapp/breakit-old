
/*
 * GET home page.
 */
var models = require('../model');
var pictureModel = require('../models/PictureModel');



exports.index = function(req, res){
  var pictures = pictureModel.allSorted();
  res.render('index', { title: 'BreakIt', pictures: pictures });
};

exports.test = function(req, res){
	console.log(req.body);
	console.log(req.body.testkey);
	console.log("test3");
	
	// get the location of the user
	// get the pictures
	// calculate relative points to the pictures

// for each picture in pictures
// get the location x 
// get the location y = testkey 	
// distance: 	d = sqrt( (x2 - x1)^2 + (y2 -y1)^2
// if d > 100 => reduce the points by multiplying by 0,5
// if d > 200 => reduce the points by multiplying by 0,3
	
// 
	
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
