// Model functions

var models = require('../model');

models.Picture.changeScore = function(number) {
    console.log(number);
}

models.Picture.allSorted = function(callback) {
    var pictures = [];
    models.Picture.find().sort('points', 'descending').run(function (err, pics){
        if(err) {
            throw err;
        }
        // push pictures from object to an array
        pics.forEach(function(pic) {
            pictures.push(pic);
        })
        callback(null, pictures);
    });
};