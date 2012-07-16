/*****
 * Model for pictures
 * BreakIt 0.0.2
 *
 * @type {*}
 */

// requires the models

var models = require('../model'),
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
			models.Picture.find({loc: {$within: {$centerSphere: [[lon, lat], 2000/6713]}}}).sort('date': -1).skip((20*page)-20).limit(20).exec(function(err, pics){
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
		//Changes the distance from meter to km and rounds when needed
		function(callback) {
			allPics.forEach(function(pic) {
				switch(pic.distance) {
					case(pic.distance < 0.1) :
						pic.distance = 'under 100 meters';
						break;
					case(0.1 < pic.distance < 0.5) :
						pic.distance = 'under 500 meters';
						break;
					case(0.5 < pic.distance < 1) :
						pic.distance = 'under 1 kilometer';
						break;
					default :
						pic.distance = Math.floor(pic.distance)+' km';
				}
			});
			callback(null, relsortedPics);
		}
		],
		function(err, results) {
			callback(results[1]);
			return results[1];
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
		console.log('distance from picture' + picture_.distance);

    return picture_;
};

exports.allSorted = models.Picture.prototype.allSorted;
exports.relSorted = models.Picture.prototype.relativeSort;

