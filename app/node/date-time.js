exports.dateTime = function(date){
	function getDate(date){
		if(!date) return new Date();
		if(typeof(date) === "string"){
			return new Date(Date.parse(date.replace(/-/g, "/")));
		} 
		if(date instanceof Date) return date;
		return new Date();
	}
	
	function MinuteRange(start, end, isBeforeNow){
		return {
			start: Number(start) || 0,
			end: Number(end) || 0,
			isBeforeNow: !!isBeforeNow,
			isInRange: function(minute){
				if(!minute) return false;
				return minute >= start && minute;
			},
			toTimeString: function(){
				return String(parseInt(start/60)).padLeft('0',2) + ':' + String(parseInt(start%60)).padLeft('0',2)
						+ '-' + String(parseInt(end/60)).padLeft('0',2) + ':' + String(parseInt(end%60)).padLeft('0',2)
			}
		};
	}

	var time = getDate(date);
	var now = new Date();
	return {
		date: time.toDateString(),
		minutesInDay: time.getMinutesInDay(),
		minutesArray: function(minuteRange){
			return [];
		}
	};
};

Date.prototype.toDateString = function () {
	var _date = this;
	return _date.getFullYear() + '-' + _date.getMonth() + '-' + _date.getDate();
};

Date.prototype.getMinutesInDay = function () {
	var _date = this;
	return _date.getHours() * 60 + _date.getMinutes();
};

String.prototype.padLeft = function(char,length) {
	if(this.length >= length) return this;
	var s = this;
	for(var i = 0; i< length - this.length; i++){
		s = char + s;
	}
	return s;
};