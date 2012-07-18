var models 	= require('../model');

//Creates a new comment
models.Comment.prototype.createComment = function(comment_, callback) {
	var comment = new models.Comment({
		comment		:	comment_
	});
	comment.save(function(err) {
		if(err) throw err;
		callback(comment);
		return comment;
	});
}

exports.createComment = models.Comment.prototype.createComment;
