// Model functions

var models = require('../model');
var async = require('async');

models.Picture.changeScore = function(number) {
    console.log(number);
}

models.Picture.allSorted = function(callback) {
    var pictures = [];
    models.Picture.find().sort('points', 'descending').run(function (err, pics){
        if(err) {
            throw err;
        }
        // push pictures from object to an array
        pics.forEach(function(pic) {
            pictures.push(pic);
        })
        callback(null, pictures);
    });
    return pictures;
};

models.Picture.prototype.relativeSort = function(viewer_location) {

console.log("test 4");
var sortedPics = [];
var relsortedPics = [];
 
 sortedPics = this.allSorted();
 sortedPics.forEach(function(pic) {
	 //console.log("pic: "+ pic);	 
	 var relPic = relativePoints(viewer_location,pic);
	 //console.log("relPic: "+ relPic);
 })

 relsortedPics.sort(function compare(a,b) {
  if (a.points < b.points)
     return -1;
  if (a.points > b.points)
    return 1; 
  return 0;
})

//console.log("return: "+ relsortedPics);

return relsortedPics;
}

var relativePoints = function(viewerLocation, picture) {
	console.log('PICTURE: '+picture);
	
	var absolute_points = picture.points;
	var viewerLocation = viewerLocation;
	var picLocation = picture.location[0];	
	
	var R = 6371; // km

	console.log('R' + R);

	console.log('viewer location: ' + viewerLocation.latitude + ' '+ viewerLocation.longitude);
	console.log('picture location: ' + picLocation.latitude + ' '+ picLocation.longitude);
	
	// Uses haversine formula to calculate distance from degrees
	// http://www.movable-type.co.uk/scripts/latlong.html
	// Currently there are two locations that are in the testdata: Helsinki & Turku
	// The location of the viewer is currently hard coded to be Helsinki
	// Currently when viewer: Helsinki and pic: Helsinki, the distance is 0km which is correct
	// TURKU - HELSINKI DISTANCE IS SMTH 7000 which is not correct

	console.log('dLat'+dLat);
	console.log('dLon'+dLon);
	console.log('lat1'+lat1);
	console.log('lat2'+lat1);
	
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 

	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var distance = R * c;


	console.log('a'+a);
	console.log('c'+c);
	
	console.log('DISTANCE: '+distance);
	
	var multiplier = 1;
	console.log(distance);
	if(distance != 0) {
	multiplier = 10/distance;
	}
	
	var picture_ = picture;
	picture_.points = (multiplier*absolute_points);
	console.log('Absolute points'+absolute_points);
	console.log('Picture points'+picture_.points);
	console.log(picture_);
	return picture_;
}

exports.allSorted = models.Picture.prototype.allSorted;
exports.relSorted = models.Picture.prototype.relativeSort;
};
