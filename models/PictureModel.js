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
	console.log(date + " : the user uploaded a picture, with the specs : ");
	console.log(picData);
  
	var latitude = parseFloat(picData.latitude, 10);
	var longitude = parseFloat(picData.longitude, 10);
	 
	var picture = new models.Picture({
		headline			:		picData.headline,
		loc						:		{lon: longitude, lat: latitude},
		location_name	:		picData.location_name,
		story					:		picData.story,
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
		if(timeSincePic >= 60) {
			timeSincePic = Math.floor(timeSincePic/60) + ' hours';
		} else if (10 < timeSincePic < 60) {
			timeSincePic = Math.floor(timeSincePic/5) + ' minutes';
		} else {
			timeSincePic += ' minutes';
		}
		pics[i].timeSince = timeSincePic;
	}
	callback(pics);
	return pics
}

// Function that sort the pictures relative to the viewers location

models.Picture.prototype.relativeSort = function(viewer_location_lon, viewer_location_lat, page, callback) {
	var lon = parseFloat(viewer_location_lon);
	var lat = parseFloat(viewer_location_lat);
	var allPics = [];
	var relsortedPics = [];
	
	async.series(
		[function(callback){
			//console.log("waterfall function 1");
			models.Picture.find({loc: {$near: [lon, lat]}}).skip((20*page)-20).limit(20).exec(function(err, pics){
				//console.log("waterfall function 1 query");
				if(err){
					throw err;
				}
				pics.forEach(function(pic) {
					allPics.push(pic);
		});
				callback(null, allPics);
			});
		},
		//Calculates the distance from the viewer to the picture
		function(callback) {
			//console.log("waterfall function 2");
			allPics.forEach(function(pic) {
				//console.log("waterfall function 2 change score");
				var relPic = relativePoints(lon, lat, pic);
				relsortedPics.push(relPic);
				//console.log("relPic: "+ relPic);
			});
			callback(null, relsortedPics);
		},
		// Orders the pictures again based on distance.
		function(callback){
			//console.log("waterfall function 3");
			relsortedPics.sort(function compare(a,b){
				//console.log("waterfall function 3 sort");
				if (a.distance < b.distance)
					return -1;
				if (a.distance > b.distance)
					return 1;
				return 0;
			})
			callback(null, relsortedPics);
		},
		//Changes the distance from meter to km and rounds when needed
		function(callback) {
			relsortedPics.forEach(function(pic) {
				if(pic.distance <0.1){
					pic.distance = 'under 100 meters';
				}	else if(0.1<pic.distance <0.5){
					pic.distance = 'under 500 meters';
				} else if(pic.distance <1){
					pic.distance = 'under 1 km';
				}	else if(pic.distance >1 && pic.distance < 10 ){
					pic.distance = Math.floor(pic.distance*10)/10 +' km' ;	
				}
				else{
					pic.distance = Math.floor(pic.distance)+' km';
				}
			});
			callback(null, relsortedPics);
		}
		],
		function(err, results) {
			callback(results[3]);
			return results[3];
		}
	);
};

// A function that calculates the points of a picture relative to the location of the viewer

var relativePoints = function(viewerLocationLong, viewerLocationLat, picture) {

    var toRad = function(deg) {
        return deg*(Math.PI/180);
    };

    var absolute_points = picture.points;
    var viewerLocationLong = viewerLocationLong;
    var viewerLocationLat = viewerLocationLat;

    var picLocationLongitude = picture.loc.lon;
    var picLocationLatitude = picture.loc.lat;
    var R = 6371; // km

    var dLat = toRad((viewerLocationLat-picLocationLatitude));
    var dLon = toRad((viewerLocationLong-picLocationLongitude));
    var lat1 = toRad(viewerLocationLat);
    var lat2 = toRad(picLocationLatitude);

    // Uses haversine formula to calculate distance from degrees
    // http://www.movable-type.co.uk/scripts/latlong.html

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var distance = R * c;

		var picture_ = picture; 
		picture_.distance = distance;

    return picture_;
};

exports.allSorted = models.Picture.prototype.allSorted;
exports.relSorted = models.Picture.prototype.relativeSort;
exports.timeDifference = models.Picture.prototype.timeDifference;
exports.createPicture = models.Picture.prototype.createPicture;
