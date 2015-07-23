
exports.User = function (){
	return {
		id : 0,
		name : "",
		password : "",
		ip : "",
		mac : "",
		createDate : "",
		updateDate : ""
	};
}

exports.Room = function (){
	return {
		id : 0,
		name : "",
		address : "",
		description : "",
		status : "",
		createDate : "",
		updateDate : ""
	};
}

exports.Reservation = function (){
	return {
		id : 0,
		userId : "",
		userName : "",
		roomId : "",
		roomName : "",
		date : "",
		startMinute : "",
		endMinute : "",
		createDate : ""
	};
}