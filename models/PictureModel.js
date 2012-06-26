/*****
 * Model for pictures
 * BreakIt 0.0.2
 *
 * @type {*}
 */

// requires the models

var models = require('../model'),
	async = require('async');

// Function for finding all pictures sorted by points

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
// 21.06. Does not return a valid array, because of asynchronity
// TODO Get the function to wait for the sorting before returning the picture-array
/*var myfunc1 = function(callback) {
	var a = 1;
	console.log ("In my func1");
	callback(null, 'test');
};
var myfunc2 = function(callback) {
	var b = 2;
	console.log ("In my func2");
	callback(null, 'test');

};*/
models.Picture.prototype.relativeSort = function(viewer_location_long, viewer_location_lat) {
	/*console.log("Rel Sort");

    // Finds all the pictures
    async.series([myfunc1, myfunc2],
    	function(err, results){
    		if(err) {
    			throw err;
    		}
    	console.log("call back func");
    	});*/
	    var sortedPics = [];
	    var relsortedPics = [];
    	models.Picture.find({},function(err, pics){
    		if(err){
    			throw err;
    		}
    		pics.forEach(function(pic) {
    			sortedPics.push(pic);
    		});
    		//Changes the score of the picture depending on the location of the viewer
    		sortedPics.forEach(function(pic) {
            	var relPic = relativePoints(viewer_location_long, viewer_location_lat, pic);
            	relsortedPics.push(pic);
       //     	console.log("relPic: "+ relPic);
        	});
    	}) 
        	
    	relsortedPics.sort(function compare(a,b){
    		if (a.points < b.points)
    			return -1;
    		if (a.points > b.points)
    			return 1;
    		return 0;
    	})  
    // Orders the pictures again.
};

// A function that calculates the points of a picture relative to the location of the viewer

var relativePoints = function(viewerLocationLong, viewerLocationLat, picture) {

    var toRad = function(deg) {
        return deg*(Math.PI/180);
    };

    var absolute_points = picture.points;
    var viewerLocationLong = viewerLocationLong;
    var viewerLocationLat = viewerLocationLat;

    var picLocationLongitude = picture.longitude;
    var picLocationLatitude = picture.latitude;
    //console.log(picLocation);
    var R = 6371; // km

    var dLat = toRad((viewerLocationLat-picLocationLatitude));
    var dLon = toRad((viewerLocationLong-picLocationLongitude));
    var lat1 = toRad(viewerLocationLat);
    var lat2 = toRad(picLocationLatitude);

    //console.log('R' + R);

    //console.log('viewer location: ' + viewerLocation.latitude + ' '+ viewerLocation.longitude);
    //console.log('picture location: ' + picLocation.latitude + ' '+ picLocation.longitude);

    // Uses haversine formula to calculate distance from degrees
    // http://www.movable-type.co.uk/scripts/latlong.html
    // Currently there are two locations that are in the testdata: Helsinki & Turku
    // The location of the viewer is currently hard coded to be Helsinki
    // Currently when viewer: Helsinki and pic: Helsinki, the distance is 0km which is correct
    // TURKU - HELSINKI DISTANCE IS SMTH 7000 which is not correct

/*    console.log('dLat'+dLat);
    console.log('dLon'+dLon);
    console.log('lat1'+lat1);
    console.log('lat2'+lat1);*/

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var distance = R * c;


 //   console.log('a'+a);
 //   console.log('c'+c);

    //console.log('DISTANCE: '+distance);

    var multiplier;
//    console.log(distance);
    if(distance !== 0) {
        multiplier = 10/distance;
    } else {
        multiplier = 1;
    }
 //   console.log(multiplier);
    var picture_ = picture;
    picture_.points = (multiplier*absolute_points);
 /*   console.log('Absolute points'+absolute_points);
    console.log('Picture points'+picture_.points);
    console.log(picture_);*/
    return picture_;
};

exports.allSorted = models.Picture.prototype.allSorted;
exports.relSorted = models.Picture.prototype.relativeSort;
