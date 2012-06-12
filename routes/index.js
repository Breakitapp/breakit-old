
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
		// THIS TEST KEY IS THE LOCATION OF BROWSER (USER AGENT = PHONE)
		console.log('testkey:'+req.body.testkey);
		
		// CHANGE THE HARD CODED HELSINKI KEY TO USE CURRENT LOCATION OF THE BROWSER
		// AFTER THE LOCATION LOGIC IS ACCURATE USING HELSINKI AND TURKU TEST CASES
		var helsinki = new models.Location({longitude: 60.17083, latitude: 24.9375});
		
		console.log("type: "+ typeof(req.body.testkey));
		
		var pictures = pictureModel.relSorted(helsinki);
		
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
