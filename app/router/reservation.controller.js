var reservationService = require("../service/reservation.service")();
var roomService = require("../service/room.service")();
var userService = require("../service/user.service")();
var clientHelper = require('../util/client-helper');
var logger = require("../util/logger").getLogger("reservationController");
var constants = require('../constants');

module.exports = function () {
    var me = {};

    function responseJson(res, obj) {
        logger.info("response json= %j", obj);
        res.json(obj);
    }

    //reservation
    me.findByDate = function (req, res) {
        if (!req.query || !req.query.date) {
            responseJson(res, { success: false, message: "date required." });
            return;
        }
        reservationService.findByDate(req.query.date, function (err, rows) {
            if (err || !rows || rows.length == 0) {
                logger.info("find reservation by date empty.", "err=", err);
                responseJson(res, { reservations: [] });
            } else {
                responseJson(res, { reservations: rows });
            }
        });
    };

    me.addReservation = function (req, res) {
        if (!req.query || !req.query.roomId || !req.query.date || !req.query.start || !req.query.end) {
            responseJson(res, { success: false, message: "roomId,date,start,end required." });
            return;
        }
        if (Number(req.query.start) >= Number(req.query.end)) {
            responseJson(res, { success: false, message: "end must greater than start." });
            return;
        }

        var cookie = clientHelper.cookie(req, res);
        var uid = cookie[constants.cookie.userId];

        var ip = clientHelper.getIp(req).ip;
        userService.getUserById(uid, function (err, user) {
            if (err || !user || !user.name) {
                logger.info('no user to reservation.', ip, "err:", err);
                responseJson(res, { success: false, message: "not exist user." });
                return;
            }
            roomService.getRoomById(req.query.roomId, function (err, room) {
                if (err || !room || !room.name) {
                    logger.info('no room to reservation.', req.query.roomId, "err:", err);
                    responseJson(res, { success: false, message: "not exist room." });
                    return;
                }
                reservationService.existReservation(req.query.roomId, req.query.date, Number(req.query.start), Number(req.query.end)
                    , function (err, exist) {
                        if (err) {
                            logger.info('exsit reservation error.', err);
                            responseJson(res, { success: false, message: "error." + err });
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
                                , Number(req.query.start), Number(req.query.end), req.query.comment, function (err, newR) {
                                    if (err) logger.info('add reservation error.', err);
                                    if (err || !newR) {
                                        responseJson(res, { success: false });
                                    } else {
                                        logger.info('add reservation success');
                                        responseJson(res, { success: true, reservation: newR });
                                    }
                                });
                        }
                    });
            });
        });
    };

    me.deleteReservation = function (req, res) {
        if (!req.query || !req.query.id) {
            responseJson(res, { success: false, message: "id required." });
            return;
        }
        reservationService.deleteReservation(req.query.id, function (err, count) {
            if (err) {
                logger.info('delete reservation error.' + req.query.id, err);
            } else {
                responseJson(res, { success: count > 0, count: count });
            }
        });
    };

    me.listReservation = function (req, res) {
        var cookie = clientHelper.cookie(req, res);
        var uid = cookie[constants.cookie.userId];
        var date = req.query.date;
        var interval = req.query.interval;

        roomService.allActiveRooms(function (err, rows) {
            if (err || !rows || rows.length == 0) {
                logger.info("room empty", err);
                responseJson(res, { success: false, message: "no rooms", reservations: [] });
            } else {
                reservationService.listReservation(uid, date, interval, rows, function (err, reservations) {
                    if (err) {
                        responseJson(res, { success: false, message: err, reservations: [] });
                    } else {
                        responseJson(res, { success: true, reservations: reservations, });
                    }
                });
            }
        });
    };

    return me;
};
