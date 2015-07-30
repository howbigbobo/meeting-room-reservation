var service = require("./service");
var userService = service.userService();
var roomService = service.roomService();
var reservationService = service.reservationService();
var clientHelper = require('./client-helper');
var logger = require("./logger").getLogger("controller");

exports.controller = function () {
    var me = {};

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
                return {};
            }
            logger.info("user=");
            logger.info(user);
            return user;
        });
    };

    me.login = function (req, res, match) {

    };

    me.addUser = function (req, res, match) {

    };

    me.getReservations = function (req, res, match) {

    };

    me.addReservation = function (req, res, match) {

    };

    me.removeReservation = function (req, res, match) {

    };

    return me;
};
