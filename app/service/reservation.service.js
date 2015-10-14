var db = require("../dao/dao").db();
var dateTime = require('../util/date-time').dateTime;
var logger = require('../util/logger').getLogger("reservation.service");

module.exports = function () {
    var me = {};
    me.addReservation = function (user, room, date, start, end, comment, callback) {
        date = dateTime(date).date;
        var reservation = {
            userId: user._id, userName: user.name, ip: user.ip, roomId: room._id, roomName: room.name
            , date: date, startMinute: start, endMinute: end, comment: comment, createDate: (new Date()).format()
        };
        logger.info('add reservation=', reservation);
        db.reservations.insert(reservation, callback);
    };

    me.findByDate = function (date, callback) {
        date = dateTime(date).date;
        logger.info('find by date=', date);
        db.reservations.find({ date: date }, callback);
    };

    me.deleteReservation = function (reservationId, callback) {
        logger.info('delete reservation, id=', reservationId);
        db.reservations.remove({ _id: reservationId }, callback);
    };

    me.existReservation = function (roomId, date, startMinute, endMinute, callback) {
        date = new dateTime(date);
        logger.info("exist reservation : roomId=" + roomId, ",date=" + date.date)
        db.reservations.find({ roomId: roomId, date: date.date }, function (err, rows) {
            if (err) callback(err, false);
            else {
                if (!rows || rows.length == 0) {
                    callback(null, false);
                    return;
                }
                var exist = { exist: false, reservation: null };
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
        return (start < start2 && end > start2) || (start > start2 && end2 > start);
    }

    me.listReservation = function (uid, date, interval, rooms, callback) {
        logger.info('list reservation: uid=', uid, 'date=', date);
        if (!rooms || !rooms.length) {
            callback("no room for reservation.", null);
            return;
        }
        uid = uid || '';
        date = date || new Date();

        var dtime = new dateTime(date, interval);
        db.reservations.find({ date: dtime.date }).sort({ startMinute: 1 }).exec(function (err, docs) {
            if (err) {
                callback(err, null);
                return;
            }
            docs = docs || [];
            var roomGroupReservations = groupbyRoomId(docs);

            var roomResArr = [];
            for (var r = 0; r < rooms.length; r++) {
                var roomReserves = roomGroupReservations[rooms[r]._id];
                if (roomReserves && roomReserves.length) {
                    setReservation(roomReserves, uid, dtime.date);
                }
                roomResArr.push(
                    {
                        room: rooms[r],
                        reservations: roomReserves
                    });
            }

            callback(null, roomResArr);
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

        function setReservation(roomReserveList, uid, reserveDate) {
            var currentMinute = (new Date()).getMinutesInDay();
            var currentDate = (new Date()).toDateString();
            for (var i = 0; i < roomReserveList.length; i++) {
                var rr = roomReserveList[i];
                rr.currentUser = uid === rr.userId;
                rr.enable = isAfterNow(currentDate, currentMinute, reserveDate, rr.endMinute);
                rr.canRevert = rr.currentUser && rr.enable;
            }
        }

        function isAfterNow(currentDate, currentMinute, date, minute) {
            return currentDate < date || (currentDate == date && currentMinute < minute);
        }
    };

    return me;
};