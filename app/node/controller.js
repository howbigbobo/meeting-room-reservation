var service = require("./service");
var userService = service.userService();
var roomService = service.roomService();
var reservationService = service.reservationService();
var clientHelper = require('./client-helper');
var logger = require("./logger").getLogger("controller");

exports.controller = function () {
    var me = {};

    function responseJson(res, obj) {
        logger.info("response json= ", obj);
        res.simpleJson(200, obj);
    }

    me.getUser = function (req, res, match) {
        console.log("getUser: in, ");
        console.log(match);
        var ip = clientHelper.getIp(req).ip;
        console.log(ip);
        userService.getUserByIp(ip, function (err, user) {
            if (err || !user) {
                console.log("getUser error=" + err);
                logger.info("user=");
                logger.info(user);
                responseJson(res, {});
                return;
            } else {
                logger.info("user=");
                logger.info(user);
                responseJson(res, user);
            }
        });
    };

    me.login = function (req, res, match) {
        logger.info("login: ", req.query);
    };

    me.addUser = function (req, res, match) {
        logger.info("addUser: ", req.query);
        userService.addUser(req.query.name, null, clientHelper.getIp(req).ip, "");
        return {success: true};
    };

    me.updateUser = function (req, res, match) {
        logger.info("addUser: ", req.query);
        userService.updateUser(req.query.name, clientHelper.getIp(req).ip, "");
        return {success: true};
    };

    //room
    me.addRoom = function (req, res, match) {
        if (!req.query || !req.query.name) {
            responseJson(res, {success: false, message: "name required."});
            return;
        }

        roomService.addRoom(req.query.name, req.query.addr, req.query.description);
        responseJson(res, {success: true});
    };

    me.updateRoom = function (req, res, match) {
        if (!req.query || !req.query.id || !req.query.name) {
            responseJson(res, {success: false, message: "id,name required."});
            return;
        }

        roomService.updateRoom(req.query.id, req.query.name, req.query.addr, req.query.description, req.query.status);
        responseJson(res, {success: true});
    };

    me.deleteRoom = function (req, res, match) {
        if (!req.query || !req.query.id) {
            responseJson(res, {success: false, message: "id required."});
            return;
        }

        roomService.updateRoom(req.query.id, null, null, null, 'D');
        responseJson(res, {success: true});
    };

    me.allRoom = function (req, res, match) {
        roomService.allRooms(function (err, rows) {
            if (err || !rows || rows.length == 0) {
                logger.info("all room empty", err);
                responseJson(res, {rooms: []});
            } else {
                responseJson(res, {rooms: rows});
            }
        });
    };

    //reservation

    me.findByDate = function (req, res, match) {
        if (!req.query || !req.query.date) {
            responseJson(res, {success: false, message: "date required."});
            return;
        }
        reservationService.findByDate(req.query.date, function (err, rows) {
            if (err || !rows || rows.length == 0) {
                logger.info("find reservation by date empty.", "err=", err);
                responseJson(res, {reservations: []});
            } else {
                responseJson(res, {reservations: rows});
            }
        });
    };

    me.addReservation = function (req, res, match) {
        if (!req.query || !req.query.roomId || !req.query.date || !req.query.start || !req.query.end) {
            responseJson(res, {success: false, message: "roomId,date,start,end required."});
            return;
        }
        if (Number(req.query.start) >= Number(req.query.end)) {
            responseJson(res, {success: false, message: "end must greater than start."});
            return;
        }

        var ip = clientHelper.getIp(req).ip;
        userService.getUserByIp(ip, function (err, user) {
            if (err || !user || !user.id) {
                logger.info('no user to reservation.', ip, "err:", err);
                responseJson(res, {success: false, message: "not exist user."});
                return;
            }
            roomService.getRoomById(req.query.roomId, function (err, room) {
                if (err || !room || !room.id) {
                    logger.info('no room to reservation.', req.query.roomId, "err:", err);
                    responseJson(res, {success: false, message: "not exist room."});
                    return;
                }
                reservationService.existReservation(req.query.roomId, req.query.date, req.query.start, req.query.end
                    , function (err, exist) {
                        logger.info("is reservation exist?", exist);
                        if (exist && exist.exist) {
                            logger.info('reservation exist. roomId', req.query.roomId, "err:", err);
                            responseJson(res, {
                                success: false,
                                message: "reservation exist.",
                                reservation: exist.reservation
                            });
                        } else {
                            reservationService.addReservation(user, room, req.query.date
                                , Number(req.query.start), Number(req.query.end));
                            responseJson(res, {success: true});
                        }
                    });
            });
        });
    };

    me.deleteReservation = function (req, res, match) {
        if (!req.query || !req.query.id) {
            responseJson(res, {success: false, message: "id required."});
            return;
        }
        reservationService.deleteReservation(req.query.id);
        responseJson(res, {success: true});
    };

    return me;
};
