// Model functions

var models = require('../model');

var pictures = [];

models.Picture.prototype.changeScore = function(number) {
    console.log(number);
}

models.Picture.prototype.allSorted = function() {
    models.Picture.find().sort('points', 'descending').run(function (err, pics){
        if(err) {
            throw err;
        }
        //clear the array
        pictures = [];
        // add all pics to array
        pics.forEach(function(pic) {
            pictures.push(pic);
        })
    });
    return pictures;
};

exports.allSorted = models.Picture.prototype.allSorted;