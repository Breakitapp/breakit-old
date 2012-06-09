
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
    pics.forEach(function(pic) {
        pictures.push(pic);
    })
});