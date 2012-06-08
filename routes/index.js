
/*
 * GET home page.
 */

var pictures = require('../public/javascripts/pictures.js');

exports.index = function(req, res){
  res.render('index', { title: 'BreakIt', pictures: pictures.all });
};
