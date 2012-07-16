/*****
 * Model for pictures
 * BreakIt 0.0.2
 *
 * @type {*}
 */

// requires the models

var models = require('../model'),
	mongoose = require('mongoose'),
	async = require('async');

// Function for finding all pictures sorted by points DEPRECATED

models.Picture.allSorted = function(callback) {
    var pictures = [];
    models.Picture.find().sort('points', 'descending').exec(function (err, pics){
        if(err) {
            throw err;
        }
        // push pictures from object to an array
        pics.forEach(function(pic) {
            pictures.push(pic);
        });
        callback(null, pictures);
    });
    return pictures;
};

// Function that sort the pictures relative to the viewers location

models.Picture.prototype.relativeSort = function(viewer_location_lon, viewer_location_lat, page, callback) {
	var lon = parseFloat(viewer_location_lon, 10);
	var lat = parseFloat(viewer_location_lat, 10);
	var allPics = [];
	var relsortedPics = [];
	
	async.series(
		[function(callback){
			//console.log("waterfall function 1");
			models.Picture.find({loc: {$within: {$centerSphere: [[lon, lat], 2000/6713]}}}).skip((20*page)-20).limit(20).exec(function(err, pics){
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
		//Calculates the distance from the picture to the viewer
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
		function(callback) {
			relsortedPics.sort(function(a,b) {
				if(a.distance < b.distance) return -1;
				if(a.distance < b.distance) return 1;
				return 0;
			});
			callback(null, relsortedPics);
		},
		//Changes the distance from meter to km and rounds when needed
		function(callback) {
			relsortedPics.forEach(function(pic) {
				if(pic.distance < 0.1) {
					pic.distance = 'under 100 meters';
				} else if(0.1 < pic.distance < 0.5) {
					pic.distance = 'under 500 meters';
				} else if(0.5 < pic.distance < 1) {
					pic.distance = 'under 1 kilometer';
				} else if(1 < pic.distance < 10) {
					pic.distance = Math.floor(pic.distance*10)/10 + ' kilometers';
				} else {
					pic.distance = Math.floor(pic.distance) + ' kilometers';
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
		console.log(picture_);

    return picture_;
};

exports.allSorted = models.Picture.prototype.allSorted;
exports.relSorted = models.Picture.prototype.relativeSort;

