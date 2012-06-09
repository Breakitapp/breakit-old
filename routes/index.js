
/*
 * GET home page.
 */
var models = require('../model');

var pictures = [];

models.Picture.find({}, function(err, pics) {
    if(err) {
        throw err;
    }
    pics.forEach(function(pic) {
        pictures.push(pic);
    })
});

exports.index = function(req, res){
  res.render('index', { title: 'BreakIt', pictures: pictures });
};

exports.index_post = function(req, res){
    console.log(req.body._id, req.body.points);
    pictures.forEach(function(pic) {
        if(pic._id == req.body._id) {
            models.Picture.findOne({_id : pic._id}, function(err, pic) {
                console.log(pic);
            });
            models.Picture.update({_id: pic._id}, {$inc: {points : req.body.points}});
        }
    });
    res.redirect('/');
};