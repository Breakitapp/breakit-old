/****
 Module dependencies
 ****/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schemas

var UserSchema = new Schema({
    name    :   {type: String, index: true}
});

var LocationSchema = new Schema({
    longitude:  {type: Number, default: 0.0000000},
    latitude :  {type: Number, default: 0.0000000}
});

var PictureSchema = new Schema({
    name    :   {type: String, index: true},
    user    :   [User],
    points  :   {type: Number, default: 0},
    location:   [Location],
    story	:	{type: String, index: true}
});

// Models
PictureSchema.on('init', function(model) {
  model.prototype.url = function(req) {
    return "http://" + req.headers.host + "/#" +  this._id;
  };
});

var Picture = mongoose.model('Picture', PictureSchema);
var User = mongoose.model('User', UserSchema);
var Location = mongoose.model('Location', LocationSchema);

exports.User = User;
exports.Picture = Picture;
exports.Location = Location;

/*
var mikko = new User({name: 'Mikko Majuri'});

mikko.save(function(error){
    if(error){
        res.json(error);
    }
});

var helsinki = new Location({longitude: 60.17083, latitude: 24.9375});
var turku = new Location({longitude: 60.4500, latitude: 22.2500});

var picture1 = new Picture({name: 'images/1.jpg', user: mikko, points: 1000, location: helsinki});
var picture2 = new Picture({name: 'images/2.jpg', user: mikko, points: 500, location: turku});
var picture3 = new Picture({name: 'images/3.jpg', user: mikko, points: 2000, location: helsinki});
var picture4 = new Picture({name: 'images/4.jpg', user: mikko, points: 100, location: turku});
var picture5 = new Picture({name: 'images/5.jpg', user: mikko, points: 4000, location: helsinki});
var picture6 = new Picture({name: 'images/6.jpg', user: mikko, points: 300, location: turku});
var picture7 = new Picture({name: 'images/7.jpg', user: mikko, points: 10, location: helsinki});

picture1.save(function(error){
    if(error){
        res.json(error);
    }
});
picture2.save(function(error){
    if(error){
        res.json(error);
    }
});
picture3.save(function(error){
    if(error){
        res.json(error);
    }
});
picture4.save(function(error){
    if(error){
        res.json(error);
    }
});
picture5.save(function(error){
    if(error){
        res.json(error);
    }
});
picture6.save(function(error){
    if(error){
        res.json(error);
    }
});
picture7.save(function(error){
    if(error){
        res.json(error);
    }
});
*/

