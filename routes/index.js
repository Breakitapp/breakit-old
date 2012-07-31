/*****
 * Routes for BreakIt 0.0.2
 *
 * @type {*}
 */

//Module dependencies

var models			= require('../model')
  , async				= require('async')
  , picture			= require('../models/PictureModel')
	,	comment			=	require('../models/CommentModel')
	, feedback		= require('../models/FeedbackModel')
  , formidable	= require('formidable')
	, mailer			= require('nodemailer')
  , format			= require('util').format
  , fs 					= require('fs')
	,	url 				= require('url')
	,	dt					= require('../models/DateModel');

// Get root
exports.index = function(req, res){
	//renders the landing page. not the most elegant solution, propably needs refactoring
  res.render('landing', {req: req, title: 'BreakIt'});
	
};

//Refresh homepage with the location of the viewer
exports.location_refresh = function(req, res){

	var lon = req.query['lon'];
	var lat = req.query['lat'];
	var page = req.query['page'];
	console.log('page is ' + page);
	var date = dt.getDate();

	//This is a crude logging mechanism, that writes the date and location of a viewer. is done only on the first load
	if(page == 0) {
		console.log(date + " : the location of the viewer " + lon +" longitude and " +  lat + " latitude");
	}
	page++;
	
	async.waterfall([function(callback) {
		picture.relSorted(lon, lat, page, function(pics) {
			callback(null, pics);
		});
	},
	function(pics, callback){
		picture.timeDifference(pics, function(pics) {
			callback(null, pics)
		});
	}
	],
	function(err, result){
		if(err) {
			throw err;
		}
		res.render('index', {
			req :  req, 
			title: 'BreakIT', 
			pictures: result, 
			lat: lat, 
			lon: lon, 
			page: page,
			show_comments : null});
	});
};

//Takes the uploaded picture, creates a new mongo-document based on it
//Saves the uploaded picture with a name based on the mongoId of the pic
//TODO naming the picture seems a little spaggethi, should be looked at

exports.upload = function(req, res) {
	picture.createPicture(req.body, function(pic) {
		var tmp_path = req.files.image.path;
		var target_path = './public/images/' + pic._id + '.jpeg';
		fs.readFile(tmp_path, function(err, data) {
			if(err) throw err;
			fs.writeFile(target_path, data, function(err) {
				if(err) throw err;
				res.redirect('back');
			});
		});
	});
};

//User registration routes

exports.registration = function(req, res) {
	res.render('registration', {title: 'Register a new BreakIt-user'});
}

exports.register_new = function(req, res) {
  var user = new models.User({
		fName		:		req.body.fName,
		lName		:		req.body.lName,
		nName		:		req.body.nName,
		email		:		req.body.email
  });
	user.save(function(err) {
		if(err) throw err;
	});
	res.send(user.fName + ': thank you for registering!');
}

exports.picture = function(req, res) {
	res.render('upload');
}

//Feedback

exports.feedback = function(req, res) {
	console.log(req.body.date + ' ' +req.body.user + ' sent following feedback : ' + req.body.feedback);
	var fb = new models.Feedback({
		feedback : req.body.feedback
	});
  fb.save(function(err) {
		if(err) throw err;
	});
	res.send('thank you for your feedback');
}

// Get a post
exports.get_post = function(req, res) {
	async.series([
		function(callback) {
			models.Picture.findById(req.params.id, function(err, pic){
				if(err) throw err;
				callback(null, pic);
			});
		}
	],
		function(err, results) {
			res.render('comment', {picture : results[0]});
		}
	);
}

exports.comment = function(req,res) {
	async.series([
		function(callback) {
			console.log(req.body.comment);
			comment.createComment(req.body.comment, function(comment) {
				callback(null, comment);
			});
		},
		function(callback) {
			models.Picture.findById(req.body.pic_id, function(err, pic){
				if(err) throw err;
				callback(null, pic);
			});
		}
	],
		function(err, results) {
			console.log(results[1], results[0]);
			results[1].addComment(results[0]);
			res.redirect('back');
		}
	);
} 

exports.show_feedbacks = function(req, res) {
	async.series([
		function(callback) {
			var fbs;
			models.Feedback.allSorted(function(err, results) {
				if(err) throw err;
				callback(null, results);
			});
		}],
		function(err, results) {
			console.log('rendering feedbacks');
			if(err) throw err;
			res.render('feedback', {feedbacks: results[0]});
		});
}

exports.signup = function(req, res) {
	res.render('signup');
}

exports.signup_post = function(req, res) {
	var email = req.body.email;
  var user = new models.User({
		email		:		email
  });
	user.save(function(err) {
		if(err) throw err;
	});

	var transport = mailer.createTransport('SES', {
		AWSAccessKeyID : 'AKIAJD3WZOFBSHHZCIYQ',
		AWSSecretKey : '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'
	});

	var mailOptions = {
		from : 'Breakit Info <info@breakitapp.com>',
		to: email,
		subject:  'Thank you for registering for Breakit beta',
		generateTextFromHTML: true,
		html: '<h1>Welcome to test the Breakit beta</h1>, <p>we’re thrilled to have you on board!<br>  We’ll notify you as soon as Breakit is ready for testing. All the feedback that you could possibly come up with at this stage, and later, will be much appreciated. We are not building this service for us personally, it´s being built for you guys out there so do pitch in your ideas for development!<br><br> In the meantime keep updated by checking out our FB page <a href="http://www.facebook.com/breakitstories"Breakit</a> and follow us on Twitter #Breakitapp!<br><br> Soon you’ll be able to both share and see things that are happening around you.<br><br> Cheers, <br><br>Breakit team Jolle, Mikko, Marko, Binit, Mohammad and Seb'
	}
	
	transport.sendMail(mailOptions, function(err, response) {
		if(err){
			console.log(err);
		}else{
			console.log("Message sent: " + response.message);
			res.send('thank you for registering for our beta, you should recieve a confirmation mail soon');
		}
	});
};
//Update the score of a pic after a post from front-end. Return the new score
//LEGACY
exports.update_score = function(req, res) {
    var points = parseInt(req.body.points, 10);
    var pic = req.body._id;
    var score_ = 0;

    models.Picture.update({_id: pic}, {$inc: {'points' : points}}, function(err, doc) {
        if(err) {
            throw err;
        }
				console.log("changed the score of "+pic+" with " + points);
    });
      
    models.Picture.find({'_id': pic}, {'points': 1}, function(err, score) {
        if(err) {
            throw err;
        }
        score_ = score[0].points;
        res.send({score: score_});
    });
};

//Splash screen routing. LEGACY
exports.splash_screen = function(req,res) {
	res.render('splash_screen', {title: 'Home Screen'});
};

//Post to splash screen creates a new user with the email entered. The user is saved and a confirm is rendered
//LEGACY
exports.splash_screen_post = function(req, res) {
	var email = req.body.email_field;
	var user = new models.User({email: email}) ;
	user.save(function(err) {
		if(err) throw err;
	});
	res.render('splash_screen_confirm', {title: 'Confirm'});
};

//for testing
exports.test = function(req, res) {
	console.log(req.query['lon'], req.query['lat']);
	res.render('upload')
}
