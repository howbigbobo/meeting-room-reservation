exports.dateTime = function (date, intervalMinute) {
    intervalMinute = intervalMinute || 60;

    function getDate(date) {
        if (!date) return new Date();
        if (typeof(date) === "string") {
            return new Date(Date.parse(date.replace(/-/g, "/")));
        }
        if (date instanceof Date) return date;
        return new Date();
    }

    function toTimeString(start, end) {
        return String(parseInt(start / 60)).padLeft('0', 2) + ':' + String(parseInt(start % 60)).padLeft('0', 2)
            + '-' + String(parseInt(end / 60)).padLeft('0', 2) + ':' + String(parseInt(end % 60)).padLeft('0', 2)
    }

    function buildMinuteRange() {
        var nowMinute = now.getMinutesInDay();
        var startTime = new Date(time.getFullYear(), time.getMonth() + 1, time.getDate(), 9, 0);
        var endTime = new Date(time.getFullYear(), time.getMonth() + 1, time.getDate(), 18, 0);
        var startMinute = startTime.getMinutesInDay();
        var endMinute = endTime.getMinutesInDay();
        var ranges = [];
        var isToday = time.toDateString() === now.toDateString();
        var isTomorrow = getDate(time.toDateString()) > getDate(now.toDateString());
        for (var i = startMinute; i <= endMinute; i += intervalMinute) {
            var range = {};
            range.start = i;
            range.end = i + intervalMinute - 1;
            range.text = toTimeString(range.start, range.end + 1);
            range.enable = isTomorrow || (isToday && range.start >= nowMinute - intervalMinute);
            ranges.push(range);
        }
        return ranges;
    }

    var time = getDate(date);
    var now = new Date();
    return {
        date: time.toDateString(),
        minutesInDay: time.getMinutesInDay(),
        minutesArray: buildMinuteRange
    };
};

Date.prototype.toDateString = function () {
    var _date = this;
    return _date.getFullYear() + '-' + String(_date.getMonth() + 1).padLeft('0', 2) + '-' + String(_date.getDate()).padLeft('0', 2)
};

Date.prototype.getMinutesInDay = function () {
    var _date = this;
    return _date.getHours() * 60 + _date.getMinutes();
};

Date.prototype.format = function () {
    var _date = this;
    return _date.getFullYear() + '-' + String(_date.getMonth() + 1).padLeft('0', 2) + '-' + String(_date.getDate()).padLeft('0', 2)
        + ' ' + String(_date.getHours()).padLeft('0', 2) + ':' + String(_date.getMinutes()).padLeft('0', 2) + ':' + String(_date.getSeconds()).padLeft('0', 2);
};

String.prototype.padLeft = function (char, length) {
    if (this.length >= length) return this;
    var s = this;
    for (var i = 0; i < length - this.length; i++) {
        s = char + s;
    }
    return s;
};