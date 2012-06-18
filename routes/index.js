
/*
 * GET home page.
 */
var models = require('../model')
  , async = require('async')
  , picture = require('../models/PictureModel')
  , formidable = require('formidable')
  , format = require('util').format
  , fs = require('fs');

exports.index = function(req, res){
  // create a sync task for database related queries
  async.parallel([models.Picture.allSorted],
      function(err, results){
          if(err) {
              throw err;
          }
          res.render('index', { req: req, title: 'BreakIt', pictures: results[0] });
      });
};

exports.test = function(req, res){
    console.log(req.body);
    // THIS TEST KEY IS THE LOCATION OF BROWSER (USER AGENT = PHONE)
    console.log('testkey:'+req.body.testkey);

    // CHANGE THE HARD CODED HELSINKI KEY TO USE CURRENT LOCATION OF THE BROWSER
    // AFTER THE LOCATION LOGIC IS ACCURATE USING HELSINKI AND TURKU TEST CASES
    var helsinki = new models.Location({longitude: 60.17083, latitude: 24.9375});

    console.log("type: "+ typeof(req.body.testkey));

    var pictures = picture.relSorted(helsinki);

    res.render('index', { title: 'BreakIt', pictures: pictures });
};


exports.index_post = function(req, res) {
    var points = parseInt(req.body.points);
    var pic = req.body._id;
    var score_ = 0;
    //console.log(pic, points);

    models.Picture.update({_id: pic}, {$inc: {'points' : points}}, function(err, doc) {
        if(err) {
            throw err;
        }
    });
      
    models.Picture.find({'_id': pic}, {'points': 1}, function(err, score) {
        if(err) {
            throw err;
        }
        score_ = score[0].points;
        res.send({score: score_});
    });
};

exports.index_fbshare = function(req,res) {
  res.render('fbshare', {title: 'FBShare'});
};

var emails = [];

exports.index_splashscreen = function(req,res) {
	if (emails.length > 0) {
		res.render('splashscreen_confirm', {title: 'Confirm'});
	}  
	res.render('splash_screen', {title: 'Home Screen'});
};

exports.index_splashscreen_post = function(req, res) {
	var email = req.body.email_field;
	var user = new models.User({email: email}) ;
	emails.push(email);
	//console.log(user);
	//console.log(emails);
	res.redirect('back');
}

exports.popUp = function(req, res) {
    res.render('test', {title: 'Test'});
};

exports.footer = function(req, res) {
	res.render('footer', {title: 'Footer'});
};

exports.upload = function(req, res) {
    var tmp_path = req.files.image.path;
    var target_path = './public/images/' + req.files.image.name;
    fs.readFile(tmp_path, function(err, data) {
        if(err) throw err;
        fs.writeFile(target_path, data, function(err) {
            if(err) throw err;
            res.redirect('back');
        })
    });
};

exports.picture = function(req, res) {
    res.render('upload', {title: 'uploadtest'});
};
