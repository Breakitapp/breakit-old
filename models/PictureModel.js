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
    models.Picture.find().sort('points', 'descending').run(function (err, pics){
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
				if(pic.distance <1){
					pic.distance = Math.floor(pic.distance*1000)+' meters';
				}					else if(pic.distance >1 && pic.distance < 10 ){
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
