
/*
 * GET home page.
 */
var models = require('../model');

var pictures = [];

exports.index = function(req, res){
  res.render('index', { title: 'BreakIt', pictures: pictures });
};


models.Picture.find().sort('points', 'descending').run(function (err, pics){
    if(err) {
        throw err;
    }
    // add all pics to array
    pics.forEach(function(pic) {
        pictures.push(pic);
    })
});

exports.index = function(req, res){
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
