
/*
 * GET home page.
 */
var models = require('../model');

var pictures = [];

models.Picture.find({}, function(err, pics) {
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
	
exports.index_post = function(req, res){
    console.log(req.body);
    res.redirect('/');
};