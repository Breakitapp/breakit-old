exports.getDate = function() {
	var dt = new Date();
	var second = dt.getSeconds();
	var minute = dt.getMinutes();
	var hour = dt.getHours();
	var month = dt.getMonth()+1;
	var day = dt.getDate();
	var year = dt.getFullYear();
	var date = year + '/' + month + '/' + day + ' : ' + hour + ':' + minute + ':' + second;
	
	return date;
}

exports.dateForComment = function () {
	var dt = new Date();
	var second = dt.getSeconds();
	var minute = dt.getMinutes();
	var hour = dt.getHours()+3;
	var month = dt.getMonth()+1;
	var day = dt.getDate();
	var year = dt.getFullYear();
	var date = dt.toLocaleDateString() +  ' ' + hour + ':' + minute;
	
	return date;
}
