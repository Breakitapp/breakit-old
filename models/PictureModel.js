/*****
 * Model for pictures
 * BreakIt 0.0.2
 *
 * @type {*}
 */

//Module and model dependencies

var models 	= require('../model')
	,	async 	= require('async')
	,	fs			= require('fs')
	,	dt			=	require('./DateModel');

//Creates a ne picture document and stores it
models.Picture.prototype.createPicture = function(picData, callback) {
	var date = dt.getDate();
	var tag;
	if(picData.tag) {
		tag = picData.tag;
	}
	console.log(date + " : the user uploaded a picture, with the specs : ");
	console.log(picData);
  
	var latitude = parseFloat(picData.latitude, 10);
	var longitude = parseFloat(picData.longitude, 10);
	 
	var picture = new models.Picture({
		headline			:		picData.headline,
		loc						:		{lon: longitude, lat: latitude},
		location_name	:		picData.location_name,
		story					:		picData.story,
		tags					:		tag,
		user					:		picData.user
	});

	//TODO Only handles jpegs, needs to inlcude png and gif.
	picture.name = 'images/' + picture._id + '.jpeg';
	picture.save(function(err) {
		if(err) throw err;
	});
	callback(picture);
	return picture;
}

models.Picture.prototype.addComment = function(comment) {
	this.comments.push(comment);
	this.save(function(err) {
		if(err) throw err;
	});
}

//Calculates the timedifference between now and when the picture has been uploaded. 
models.Picture.prototype.timeDifference = function(pics, callback) {
	var dt = new Date()
	for(var i = 0; i < pics.length; i++) {
		var picDate = new Date(pics[i].date);
		var timeSincePic = dt - picDate;
		timeSincePic = Math.floor(timeSincePic/60000);
		if(timeSincePic >= 1440) {
			timeSincePic = Math.floor(timeSincePic/1440) + 'd';
		} else if(timeSincePic >= 60) {
			timeSincePic = Math.floor(timeSincePic/60) + 'h';
		} else if (10 < timeSincePic < 60) {
			timeSincePic = Math.floor(timeSincePic/5) + 'm';
		} else {
			timeSincePic += ' m';
		}
		pics[i].timeSince = timeSincePic;
	}
	callback(pics);
	return pics
}

//Function for finding all pictures inside a radius
var findInsideRadius = function(lon, lat, minDist, maxDist, callback) {
	var pictures = []
	models.Picture.db.db.executeDbCommand({geoNear : 'pictures', near : [lon, lat],  spherical : true,
		maxDistance : (maxDist/6378.16), distanceMultiplier : 6378.16}, function(err, docs) {
			if(err) throw err;
			if(docs) {
				for(var i = 0; i < docs.documents[0].results.length-1; i++) {
					var doc = docs.documents[0].results[i];
					if(doc.dis > minDist) {
						var pic = doc.obj;
						pic.distance = doc.dis;
						pictures.push(pic);
					}
				}
			}
		callback(pictures);
		return pictures;
	});
};

//helperfunction to order by date
var compare = function(a,b) {
	if (a.date > b.date)
		return -1;
	if (a.date < b.date)
		return 1;
	return 0;
};

//Find stuff for media
models.Picture.prototype.findHBL = function(callback) {
	var hbl = [];
	models.Picture.find({"tag":"HBL"}).sort("date":"descending").exec(function(err, pics) {
		if(err) throw err;
		pics.forEach(function(pic) {
			hbl.push(pic);
		});
		callback(null, hbl);
	});
	return hbl;
}

//finds all pictures and categorizes them first into radia and then orders by time
//TODO is this needed?

var findAllByRadius = function(lon, lat, callback) {
	var pictures = [];
	var dist = [0, 0.1, 0.5, 1, 10, 10000];
	var j = dist.length-2;

	var cb = function() {
		callback(pictures);
		return(pictures);
	}

	var done = function() {
		if(j == 0) {
			cb();
		} else {
			j--;
		}
	};

	//call the findInsideRadius-function for all the distances
	for(var i = 0; i < dist.length-1; i++) {
		findInsideRadius(lon, lat, dist[i], dist[i+1], function(pics) {
			pics.sort(compare);
			for(var k = 0; k < pics.length || k < 20 ; k++) {
				pictures.push(pics[k]);
			}
			done();
		});
	}
};

// Function that sort the pictures relative to the viewers location

models.Picture.prototype.relativeSort = function(viewer_location_lon, viewer_location_lat, page, callback) {
	var lon = parseFloat(viewer_location_lon);
	var lat = parseFloat(viewer_location_lat);
	var allPics = [];
	var relsortedPics = [];
	var dist = [0, 0.1, 0.5, 1, 10, 10000];
	if(page==6) {
		return;
	}
	
	async.waterfall(
		[function(callback){
			//console.log("waterfall function 1");
			findInsideRadius(lon, lat, dist[page-1], dist[page], function(allPics) {
				allPics.sort(compare);
				callback(null, allPics);
			});
		},
		function(allPics, callback) {
			allPics.forEach(function(pic) {
				if(pic.distance <0.1){
					pic.distance = '< 100m';
				}	else if(0.1 <pic.distance && pic.distance <0.5){
					pic.distance = '< 500m';
				} else if(pic.distance <1){
					pic.distance = 'under 1km';
				}	else if(pic.distance >1 && pic.distance < 10 ){
					pic.distance = Math.floor(pic.distance*10)/10 +'km' ;	
				} else {
					pic.distance = Math.floor(pic.distance)+'km';
				}
			});
			callback(null, allPics);
		}
		],
		function(err, results) {
			callback(results);
			return results;
		}
	);
};


exports.allSorted = models.Picture.prototype.allSorted;
exports.relSorted = models.Picture.prototype.relativeSort;
exports.timeDifference = models.Picture.prototype.timeDifference;
exports.createPicture = models.Picture.prototype.createPicture;
exports.findHBL = models.Picture.prototyep.findHBL;
