var service = require("./service");
var userService = service.userService();
var roomService = service.roomService();
var reservationService = service.reservationService();

exports.controller = function () {
    var me = {};

    me.getUser = function (req, res, match) {

    };

    me.login = function (req, res, match) {

    };

    me.addUser = function (req, res, match) {

    };

    me.getReservations = function (req, res, match) {

    };

    me.addReservation = function (req, res, match) {

    };

    me.removeReservation = function(req,res,match){

    };

    return me;
};
