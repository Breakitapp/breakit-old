var models 	= require('../model');
var dt			=	require('./DateModel');

//Creates a new comment
models.Comment.prototype.createComment = function(comment_, callback) {
	var date_ = dt.dateForComment();
	var comment = new models.Comment({
		comment		:	comment_,
		date			:	date_
	});
	console.log('this is the date ' +date_);
	comment.save(function(err) {
		if(err) throw err;
		callback(comment);
		return comment;
	});
}

exports.createComment = models.Comment.prototype.createComment;
