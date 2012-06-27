/****
 Module dependencies
 ****/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schemas
function toLower (v) {
	  return v.toLowerCase();
	}

var UserSchema = new Schema({
    name    :   {type: String, index: true},
	email   :   {type: String, set: toLower},
    date	:	{type: Date, default: Date.now}
});

var PictureSchema = new Schema({
    name    :   	{type: String, index: true},
		headline:			{type: String},
    user    :   	[User],
    points  :   	{type: Number, default: 0},
    longitude: 		{type: Number, default: 0.0000000},
    latitude :  	{type: Number, default: 0.0000000},
		location_name:{type: String},	 
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

exports.User = User;
exports.Picture = Picture;
 

var mikko = new User({name: 'Mikko Majuri'});

mikko.save(function(error){
    if(error){
        res.json(error);
    }
});

var helsinki_long = 60.17083;
var turku_long = 60.4500;
var helsinki_lat = 24.9375;
var turku_lat = 22.2500;

/*
var picture1 = new Picture({name: 'images/1.jpg', user: mikko, points: 1000, longitude: helsinki_long, latitude: helsinki_lat});
var picture2 = new Picture({name: 'images/2.jpg', user: mikko, points: 500, longtude: turku_long, latitude: turku_lat});
var picture3 = new Picture({name: 'images/3.jpg', user: mikko, points: 2000, longitude: helsinki_long, latitude: helsinki_lat});
var picture4 = new Picture({name: 'images/4.jpg', user: mikko, points: 100, longtude: turku_long, latitude: turku_lat});
var picture5 = new Picture({name: 'images/5.jpg', user: mikko, points: 4000, longitude: helsinki_long, latitude: helsinki_lat});
var picture6 = new Picture({name: 'images/6.jpg', user: mikko, points: 300, longtude: turku_long, latitude: turku_lat});
var picture7 = new Picture({name: 'images/7.jpg', user: mikko, points: 10, longitude: helsinki_long, latitude: helsinki_lat});

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
