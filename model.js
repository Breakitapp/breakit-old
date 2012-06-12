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
	longitude:  {type: Number, default: 0.0},
	latitude :  {type: Number, default: 0.0}
});

var PictureSchema = new Schema({
    name    :   {type: String, index: true},
    user    :   [User],
    points  :   {type: Number, default: 0},
    location:   [Location]
});

// Database connection

mongoose.connect('mongodb://localhost/breakit');

// Models

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

var location1 = new Location({});
var location2 = new Location({longitude: 64, latitude: 63});

var picture1 = new Picture({name: 'images/1.jpg', user: mikko, points: 30, location: location1});
var picture2 = new Picture({name: 'images/2.jpg', user: mikko, points: 30, location: location2});
var picture3 = new Picture({name: 'images/3.jpg', user: mikko, points: 100, location: location1});
var picture4 = new Picture({name: 'images/4.jpg', user: mikko, points: 100, location: location2});
var picture5 = new Picture({name: 'images/5.jpg', user: mikko, points: 300, location: location1});
var picture6 = new Picture({name: 'images/6.jpg', user: mikko, points: 300, location: location2});
var picture7 = new Picture({name: 'images/7.jpg', user: mikko, points: 10, location: location1});

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
