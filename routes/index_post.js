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

