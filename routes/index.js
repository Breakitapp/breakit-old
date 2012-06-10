
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
    models.Picture.find({'_id': pic}, {'points': 1}, function(err, score) {
        if(err) {
            throw err;
        }
        score_ = score[0].points;
        res.send({score: score_});
    });

};
