// Model functions

var models = require('../model');

var pictures = [];

models.Picture.prototype.changeScore = function(number) {
    console.log(number);
}

models.Picture.prototype.allSorted = function() {
    models.Picture.find().sort('points', 'descending').run(function (err, pics){
        if(err) {
            throw err;
        }
        //clear the array
        pictures = [];
        // add all pics to array
        pics.forEach(function(pic) {
            pictures.push(pic);
        })
    });
    return pictures;
};

models.Picture.prototype.relativeSort = function(viewer_location) {

console.log("test 4");
var sortedPics = [];
var relsortedPics = [];
 
 sortedPics = this.allSorted();
 sortedPics.forEach(function(pic) {
	 console.log("pic: "+ pic);
	 console.log("pic location: "+ pic.location);
	 console.log("pic location: "+ typeof(pic.location));
		
	 console.log("pic location long: "+ pic.location.longitude);
	 console.log("pic location lat: "+ pic.location.latitude);
	 
	 var relPic = relativePoints(viewer_location,pic);
	 console.log("relPic: "+ relPic);
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
	var picLocation = picture.location;	
	console.log('PICTURE LOCATION: '+picLocation);
	
	console.log("type viewerloc: ",(viewerLocation.longitude));
	
	var viewLongNum = parseInt(viewerLocation.longitude);
	var viewLatNum = parseInt(viewerLocation.latitude);
	var picLongNum = parseInt(picLocation.longitude);
	var picLatNum = parseInt(picLocation.latitude);
	console.log('viewLongNum: '+viewLongNum);
	console.log('picLongNum: '+picLongNum);
	console.log('picLocation longitude: '+picLocation.longitude);
	
	var R = 6371; // km

	console.log('R' + R);

	
	var dLat = (viewLatNum-picLatNum* Math.PI/180);
	var dLon = (viewLongNum-picLongNum) * Math.PI/180;
	var lat1 = viewLatNum * Math.PI/180;
	var lat2 = picLatNum * Math.PI/180;
	
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var distance = R * c;

	console.log('dLat'+dLat);
	console.log('dLon'+dLon);
	console.log('lat1'+lat1);
	console.log('lat2'+lat1);
	console.log('a'+a);
	console.log('c'+c);
	
	console.log('distance'+distance);
	
	console.log(distance);
	var multiplier = 10/distance;
	var picture_ = picture;
	picture_.points = (multiplier*absolute_points);
	console.log(picture_.points);
	console.log(picture_);
	return picture_;
}

exports.allSorted = models.Picture.prototype.allSorted;
exports.relSorted = models.Picture.prototype.relativeSort;