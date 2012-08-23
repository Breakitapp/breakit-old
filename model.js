/****
 Module dependencies
 ****/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schemas
function toLower (v) {
	  return v.toLowerCase();
	}

var CommentSchema = new Schema({
		comment		: 	{type: String},
		date		  :		{type: String}
});

var UserSchema = new Schema({
    fName    :   {type: String},
		lName    :   {type: String},
    nName    :   {type: String},
		email	   :   {type: String, set: toLower},
    date		 :	 {type: Date, default: Date.now},
		beta		 :	 {type: Boolean, default: false},
		phone		 :	 {type: String}
});

//TODO link picture with user.

var PictureSchema = new Schema({
    name    			:   	{type: String, index: true},
		headline			:			{type: String},
    user    			:   	{type: String},
    points  			:   	{type: Number, default: 1},
		loc						:			{lon: Number, lat: Number},
		location_name	:			{type: String},	 
    story					:			{type: String, index: true},
		date		 			:			{type: Date, default: Date.now},
		tags					:			{type: String},
		publish				:			{type: Boolean, default: false},
		comments			:			[Comment]
});

PictureSchema.index({loc: '2d'});

var FeedbackSchema = new Schema({
		feedback : {type: String},
		date : {type: Date, default: Date.now}
});

// Models

PictureSchema.on('init', function(model) {
  model.prototype.url = function(req) {
    return "http://" + req.headers.host + "/#" +  this._id;
  };
});

var Picture = mongoose.model('Picture', PictureSchema);
var User = mongoose.model('User', UserSchema);
var Feedback = mongoose.model('Feedback', FeedbackSchema);
var Comment = mongoose.model('Comment', CommentSchema);

exports.User = User;
exports.Picture = Picture;
exports.Feedback = Feedback;
exports.Comment = Comment;

/*
var mikko = new User({name: 'Mikko Majuri'});

mikko.save(function(error){
    if(error){
        res.json(error);
    }
});

var helsinki_lon = 60.17083;
var turku_lon = 60.4500;
var helsinki_lat = 24.9375;
var turku_lat = 22.2500;
var story = "Nice boobs!";


var picture1 = new Picture({name: 'images/1.jpg', user: mikko, points: 1000, loc : {lon: helsinki_lon, lat: helsinki_lat}, story: story, tag : "HBL"});
var picture2 = new Picture({name: 'images/2.jpg', user: mikko, points: 500, loc : {lon: helsinki_lon, lat: turku_lat}, story: story});
var picture3 = new Picture({name: 'images/3.jpg', user: mikko, points: 2000, loc : {lon: turku_lon, lat: helsinki_lat}, story: story});
var picture4 = new Picture({name: 'images/4.jpg', user: mikko, points: 100, loc : {lon: turku_lon, lat: turku_lat}, story: story, tag : "HBL"});
var picture5 = new Picture({name: 'images/5.jpg', user: mikko, points: 4000, loc : {lon: turku_lon, lat: helsinki_lat}, story: story});
var picture6 = new Picture({name: 'images/6.jpg', user: mikko, points: 300, loc : {lon: helsinki_lon, lat: helsinki_lat}, story: story});
var picture7 = new Picture({name: 'images/7.jpg', user: mikko, points: 10, loc : {lon: helsinki_lon, lat: turku_lat}, story: story});

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
