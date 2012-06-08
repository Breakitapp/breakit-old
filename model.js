/****
 Module dependencies
 ****/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name    :   {type: String, index: true}
});

var PictureSchema = new Schema({
    name    :   {type: String, index: true},
    user    :   [User]
});


mongoose.connect('mongodb://localhost/breakit');

var Picture = mongoose.model('Picture', PictureSchema);
var User = mongoose.model('User', UserSchema);

exports.User = User;
exports.Picture = Picture;
/*
var mikko = new User({name: 'Mikko Majuri'});

mikko.save(function(error){
    if(error){
        res.json(error);
    }
});

var picture1 = new Picture({name: 'images/_MG_3225.JPG', user: mikko});
var picture2 = new Picture({name: 'images/_MG_3247.JPG', user: mikko});
var picture3 = new Picture({name: 'images/_MG_3249.JPG', user: mikko});
var picture4 = new Picture({name: 'images/_MG_3254.JPG', user: mikko});
var picture5 = new Picture({name: 'images/_MG_3275.JPG', user: mikko});
var picture6 = new Picture({name: 'images/_MG_3295.JPG', user: mikko});
var picture7 = new Picture({name: 'images/_MG_3345.JPG', user: mikko});

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