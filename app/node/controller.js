var service = require("./service");
var userService = service.userService();
var roomService = service.roomService();
var reservationService = service.reservationService();
var clientHelper = require('./client-helper');
var logger = require("./logger").getLogger("controller");
var userIdCookieName = "_m_uid";

exports.controller = function () {
    var me = {};

    function responseJson(res, obj) {
        logger.info("response json= ", obj);
        res.simpleJson(200, obj);
    }

    me.getUser = function (req, res, match) {
        var ip = clientHelper.getIp(req).ip;
        var cookie = clientHelper.cookie(req, res);
        var uid = cookie[userIdCookieName];
        if (!uid) {
            responseJson(res, {});
            return;
        }
        logger.info('get user: ip=' + ip, 'uid=' + uid);
        userService.getUserById(cookie[userIdCookieName], function (err, user) {
            if (err || !user) {
                logger.info('user empty: error=', err);
                responseJson(res, {});
            } else {
                logger.info('get user=', user);
                responseJson(res, user);
            }
        });
    };

    me.login = function (req, res, match) {

    };

    me.addUser = function (req, res, match) {
        logger.info("addUser: ", req.query);
        if (!req.query || !req.query.name) {
            responseJson(res, {success: false, message: "name required"});
            return;
        }
        var user = {};
        user.name = req.query.name;
        user.ip = clientHelper.getIp(req).ip;
        var cookie = clientHelper.cookie(req, res);
        var uid = cookie[userIdCookieName];
        if (uid) {
            userService.getUserById(uid, function (err, exist) {
                if (err) {
                    logger.info('get user id error.' + uid, err);
                    responseJson(res, {success: false, message: 'error.' + err})
                } else if (!exist) {
                    addUser(user);
                } else {
                    responseJson(res, {success: true, message: 'user exist', user: exist});
                }
            });
        } else {
            addUser(user);
        }

        function addUser(user) {
            userService.addUser(user, function (err, newUser) {
                if (err || !newUser) {
                    responseJson(res, {success: false, message: "error." + err});
                } else {
                    var cookie = clientHelper.cookie(req, res);
                    if (!req.query.notcookie)  cookie.setCookie(userIdCookieName, newUser._id, 2 * 365 * 24 * 60 * 60, "/");
                    responseJson(res, {success: true, user: newUser});
                }
            });
        }
    };

    me.updateUser = function (req, res, match) {
        logger.info("update user: ", req.query);
        var uid = req.query.id || clientHelper.cookie(req, res)[userIdCookieName];
        if (!req.query || !uid) {
            responseJson(res, {success: false, message: "id required"});
            return;
        }
        var user = {};
        if (req.query.name) user.name = req.query.name;
        if (!req.query.notip)  user.ip = clientHelper.getIp(req).ip;
        userService.updateUser(uid, user, function (err, updateCount) {
            if (err || !updateCount) {
                logger.info("update failed.", err)
                responseJson(res, {success: false, count: updateCount})
            } else {
                responseJson(res, {success: true, count: updateCount});
            }
        });
    };

    //room
    me.addRoom = function (req, res, match) {
        if (!req.query || !req.query.name) {
            responseJson(res, {success: false, message: "name required."});
            return;
        }
        var room = {name: req.query.name, address: req.query.addr, description: req.query.description};

        roomService.addRoom(room, function (err, newRoom) {
            if (err || !newRoom) {
                logger.info('add room failed,error=', err);
                responseJson(res, {success: false});
            } else {
                responseJson(res, {success: true, room: newRoom});
            }
        });
    };

    me.updateRoom = function (req, res, match) {
        if (!req.query || !req.query.id) {
            responseJson(res, {success: false, message: "id required."});
            return;
        }

        var room = {};
        if (req.query.name) room.name = req.query.name;
        if (req.query.addr) room.address = req.query.addr;
        if (req.query.description) room.description = req.query.description;
        if (req.query.status) room.status = req.query.status;

        roomService.updateRoom(req.query.id, room, function (err, count) {
            if (err || !count) {
                if (err) logger.info("update room err,", err);
                responseJson(res, {success: false});
            } else {
                responseJson(res, {success: count > 0, count: count});
            }
        });
    };

    me.deleteRoom = function (req, res, match) {
        if (!req.query || !req.query.id) {
            responseJson(res, {success: false, message: "id required."});
            return;
        }
        roomService.updateRoom(req.query.id, {status: 'D'}, function (err, count) {
            if (err) {
                if (err) logger.info("update room err,", err);
                responseJson(res, {success: false});
            } else {
                responseJson(res, {success: count > 0, count: count});
            }
        });
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

        var cookie = clientHelper.cookie(req, res);
        var uid = cookie[userIdCookieName];

        var ip = clientHelper.getIp(req).ip;
        userService.getUserById(uid, function (err, user) {
            if (err || !user || !user.name) {
                logger.info('no user to reservation.', ip, "err:", err);
                responseJson(res, {success: false, message: "not exist user."});
                return;
            }
            roomService.getRoomById(req.query.roomId, function (err, room) {
                if (err || !room || !room.name) {
                    logger.info('no room to reservation.', req.query.roomId, "err:", err);
                    responseJson(res, {success: false, message: "not exist room."});
                    return;
                }
                reservationService.existReservation(req.query.roomId, req.query.date, req.query.start, req.query.end
                    , function (err, exist) {
                        if (err) {
                            logger.info('exsit reservation error.', err);
                            responseJson(res, {success: false, message: "error." + err});
                            return;
                        }
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
                                , Number(req.query.start), Number(req.query.end), function (err, newR) {
                                    if (err) logger.info('add reservation error.', err);
                                    if (err || !newR) {
                                        responseJson(res, {success: false});
                                    } else {
                                        logger.info('add reservation success');
                                        responseJson(res, {success: true, reservation: newR});
                                    }
                                });
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
        reservationService.deleteReservation(req.query.id, function (err, count) {
            if (err) {
                logger.info('delete reservation error.' + req.query.id, err);
            } else {
                responseJson(res, {success: count > 0, count: count});
            }
        });
    };

    me.listReservation = function (req, res) {
        var cookie = clientHelper.cookie(req, res);
        var uid = cookie[userIdCookieName];
        var date = req.query.date;
        var interval = req.query.interval;

        roomService.allRooms(function (err, rows) {
            if (err || !rows || rows.length == 0) {
                logger.info("room empty", err);
                responseJson(res, {success: false, message: "no rooms", reservations: []});
            } else {
                reservationService.listReservation(uid, date, interval, rows, function (err, reservations) {
                    if (err) {
                        responseJson(res, {success: false, message: err, reservations: []});
                    } else {
                        responseJson(res, {success: true, reservations: reservations,});
                    }
                });
            }
        });
    };

    return me;
};
