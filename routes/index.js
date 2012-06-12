
/*
 * GET home page.
 */
var models = require('../model');
var pictureModel = require('../models/PictureModel');

exports.index = function(req, res){
  var pictures = pictureModel.allSorted();
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
