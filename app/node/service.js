var dao = require("./dao").dao();
var model = require("./model");
var dateTime = require('./date-time').dateTime;
var logger = require('./logger').getLogger("service");
var userModel = model.User();
var roomModel = model.Room();
var reservationModel = model.Reservation();

exports.roomService = function () {
    var me = {};

    me.addRoom = function (name, addr, description) {
        var room = {
            name: name,
            address: addr,
            description: description,
            status: 'A',
            createDate: (new Date()).format()
        };
        dao.add(roomModel.table, room, function (err) {
            if (err) {
                console.log(err);
            }
        });
    };

    me.updateRoom = function (id, name, addr, description, status) {
        var room = {};
        if (name) room.name = name;
        if (addr) room.address = addr;
        if (description) room.description = description;
        if (status) room.status = status;
        room.updateDate = (new Date()).format();
        logger.info("update room", room);
        dao.update(roomModel.table, room, {id: id});
    };

    me.getRoomById = function (id, callback) {
        dao.find(roomModel.table, {status: 'A', id: id}, function (err, rows) {
            var room = null;
            if (rows && rows.length > 0)room = rows[0];
            if (callback) callback(err, room);
        });
    };

    me.allRooms = function (callback) {
        dao.find(roomModel.table, {status: 'A'}, function (err, rows) {
            callback(err, rows);
        });
    };

    return me;
};

exports.userService = function () {
    var me = {};
    me.addUser = function (name, pwd, ip, mac) {
        var user = {name: name, password: pwd, ip: ip, mac: mac, createDate: (new Date()).format()};

        me.getUserByIp(ip, function (err, row) {
            if (!row) {
                dao.add(userModel.table, user, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    };

    function encryptPwd(user) {
        if (user && user.password) user.password = "******";
    }

    me.getUserByIp = function (ip, callback) {
        if (!ip) return callback(null, null);
        dao.find(userModel.table, {ip: ip}, function (err, rows) {
            var row = rows && rows.length > 0 && rows[0];
            encryptPwd(row);
            callback(err, row);
        });
    };

    me.getUserByPwd = function (name, pwd, callback) {
        if (!name || !pwd) return callback(null, null);
        dao.find(userModel.table, {name: name, password: pwd}, function (err, rows) {
            var row = rows && rows.length > 0 && rows[0];
            encryptPwd(row);
            callback(err, row);
        });
    };

    me.updateUser = function (name, ip) {
        me.getUserByIp(ip, function (err, user) {
            if (!err && user && user.id) {
                dao.update(userModel.table, {name: name, updateDate: (new Date()).format()}, {id: user.id});
            }
        });
    };

    return me;
};

exports.reservationService = function () {
    var me = {};
    me.addReservation = function (user, room, date, start, end) {
        date = dateTime(date);
        var reservation = {
            userId: user.id, userName: user.name, roomId: room.id, roomName: room.name
            , date: dateTime(date).date, startMinute: start, endMinute: end, createDate: (new Date()).format()
        };
        dao.add(reservationModel.table, reservation, function (err) {
            if (err) {
                console.log(err);
            }
        });
    };

    me.findByDate = function (date, callback) {
        date = dateTime(date);
        dao.find(reservationModel.table, {date: date.date}, function (err, rows) {
            callback(err, rows);
        });
    };

    me.deleteReservation = function (reservationId) {
        dao.delete(reservationModel.table, {id: reservationId}, function (err) {
            if (err) console.log(err);
        });
    };

    me.existReservation = function (roomId, date, startMinute, endMinute, callback) {
        date = new dateTime(date);
        dao.find(reservationModel.table, {roomId: roomId, date: date.date}, function (err, rows) {
            if (err) callback(err, false);
            else {
                if (!rows || rows.length == 0) callback(null, false);
                var exist = {exist: false, reservation: null};
                for (var i = 0; i < rows.length; i++) {
                    var es = rows[i].startMinute, ee = rows[i].endMinute;
                    if (!(ee < startMinute) && !(es > endMinute)) {
                        exist.exist = true;
                        exist.reservation = rows[i];
                        break;
                    }
                }
                callback(null, exist);
            }
        });
    };

    return me;
};