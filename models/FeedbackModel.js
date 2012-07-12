/*****
 * Model for feedback
 * BreakIt 0.0.2
 *
 * @type {*}
 */

// requires the models

var models = require('../model'),
	async = require('async');

models.Feedback.allSorted = function(callback) {
		console.log('searching feedbacks');
    var feedbacks = [];
    models.Feedback.find().sort('date', 'descending').exec(function (err, fbs){
        if(err) {
            throw err;
        }
        // push feedbacks from object to an array
        fbs.forEach(function(fb) {
            feedbacks.push(fb);
        });
        callback(null, feedbacks);
    });
    return feedbacks;
};

exports.allSorted = models.Feedback.prototype.allSorted;

