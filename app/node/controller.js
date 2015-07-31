var service = require("./service");
var userService = service.userService();
var roomService = service.roomService();
var reservationService = service.reservationService();
var clientHelper = require('./client-helper');
var logger = require("./logger").getLogger("controller");

exports.controller = function () {
    var me = {};

    function responseJson(res, obj) {
        logger.info("json= ");
        logger.info(obj);
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

    me.getReservations = function (req, res, match) {

    };

    me.addReservation = function (req, res, match) {

    };

    me.removeReservation = function (req, res, match) {

    };

    return me;
};
