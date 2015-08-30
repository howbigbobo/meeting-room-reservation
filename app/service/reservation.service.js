var db = require("../dao/dao").db();
var dateTime = require('../util/date-time').dateTime;
var logger = require('../util/logger').getLogger("reservation.service");

module.exports = function () {
    var me = {};
    me.addReservation = function (user, room, date, start, end, callback) {
        date = dateTime(date).date;
        var reservation = {
            userId: user._id, userName: user.name, ip: user.ip, roomId: room._id, roomName: room.name
            , date: date, startMinute: start, endMinute: end, createDate: (new Date()).format()
        };
        logger.info('add reservation=', reservation);
        db.reservations.insert(reservation, callback);
    };

    me.findByDate = function (date, callback) {
        date = dateTime(date).date;
        logger.info('find by date=', date);
        db.reservations.find({date: date}, callback);
    };

    me.deleteReservation = function (reservationId, callback) {
        logger.info('delete reservation, id=', reservationId);
        db.reservations.remove({_id: reservationId}, callback);
    };

    me.existReservation = function (roomId, date, startMinute, endMinute, callback) {
        date = new dateTime(date);
        logger.info("exist reservation : roomId=" + roomId, ",date=" + date.date)
        db.reservations.find({roomId: roomId, date: date.date}, function (err, rows) {
            if (err) callback(err, false);
            else {
                if (!rows || rows.length == 0) {
                    callback(null, false);
                    return;
                }
                var exist = {exist: false, reservation: null};
                for (var i = 0; i < rows.length; i++) {
                    var es = rows[i].startMinute, ee = rows[i].endMinute;
                    if (isInRange(startMinute, endMinute, es, ee)) {
                        exist.exist = true;
                        exist.reservation = rows[i];
                        break;
                    }
                }
                callback(null, exist);
            }
        });
    };

    function isInRange(start, end, start2, end2) {
        return !(end2 <= start) && !(start2 >= end);
    }

    me.listReservation = function (uid, date, interval, rooms, callback) {
        logger.info('list reservation: uid=', uid, 'date=', date, 'interval=', interval);
        if (!rooms || !rooms.length) {
            callback("no room for reservation.", null);
            return;
        }
        uid = uid || '';
        date = date || new Date();
        interval = Number(interval) || 60;

        var dtime = new dateTime(date, interval);
        var minuteArray = dtime.minutesArray();
        db.reservations.find({date: dtime.date}, function (err, docs) {
            if (err) {
                callback(err, null);
                return;
            }
            docs = docs || [];
            var roomGroupReservations = groupbyRoomId(docs);
            var reservations = [];
            for (var i = 0; i < minuteArray.length; i++) {
                var minuteRange = minuteArray[i];
                var roomResArr = [];
                for (var r = 0; r < rooms.length; r++) {
                    var reservation = {
                        isReserved: false, enable: minuteRange.enable, canRevert: false
                        , text: minuteRange.text, start: minuteRange.start, end: minuteRange.end
                        , reservation: null
                    };
                    var roomReserves = roomGroupReservations[rooms[r]._id];
                    if (roomReserves && roomReserves.length) {
                        setReservation(roomReserves, reservation, uid);
                    }
                    roomResArr.push(reservation);
                }
                reservations.push(roomResArr);
            }

            callback(null, {rooms: rooms, reservations: reservations});
        });

        function groupbyRoomId(reservations) {
            var group = {};
            for (var i = 0; i < reservations.length; i++) {
                var roomId = reservations[i].roomId;
                if (!group[roomId]) group[roomId] = [];
                group[roomId].push(reservations[i]);
            }
            return group;
        }

        function setReservation(roomReserveList, reservation, uid) {
            for (var i = 0; i < roomReserveList.length; i++) {
                if (isInRange(reservation.start, reservation.end, roomReserveList[i].startMinute, roomReserveList[i].endMinute)) {
                    reservation.reservation = roomReserveList[i];
                    reservation.isReserved = true;
                    reservation.canRevert = uid === roomReserveList[i].userId;
                    break;
                }
            }
        }
    };

    return me;
};