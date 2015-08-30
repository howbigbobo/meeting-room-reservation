var userService = require("../service/user.service")();
var clientHelper = require('../util/client-helper');
var logger = require("../util/logger").getLogger("userController");
var constants = require('../constants');

module.exports = function () {
    var me = {};

    function responseJson(res, obj) {
        logger.info("response json= %j", obj);
        res.json(obj);
    }

    me.getUser = function (req, res, match) {
        var ip = clientHelper.getIp(req).ip;
        var cookie = clientHelper.cookie(req, res);
        var uid = cookie[constants.cookie.userId];
        if (!uid) {
            responseJson(res, {});
            return;
        }
        logger.info('get user: ip=' + ip, 'uid=' + uid);
        userService.getUserById(cookie[constants.cookie.userId], function (err, user) {
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
            responseJson(res, { success: false, message: "name required" });
            return;
        }
        var user = {};
        user.name = req.query.name;
        user.ip = clientHelper.getIp(req).ip;
        var cookie = clientHelper.cookie(req, res);
        var uid = cookie[constants.cookie.userId];
        if (uid) {
            userService.getUserById(uid, function (err, exist) {
                if (err) {
                    logger.info('get user id error.' + uid, err);
                    responseJson(res, { success: false, message: 'error.' + err })
                } else if (!exist) {
                    addUser(user);
                } else {
                    responseJson(res, { success: true, message: 'user exist', user: exist });
                }
            });
        } else {
            addUser(user);
        }

        function addUser(user) {
            userService.addUser(user, function (err, newUser) {
                if (err || !newUser) {
                    responseJson(res, { success: false, message: "error." + err });
                } else {
                    var cookie = clientHelper.cookie(req, res);
                    if (!req.query.notcookie) cookie.setCookie(constants.cookie.userId, newUser._id, 2 * 365 * 24 * 60 * 60, "/");
                    responseJson(res, { success: true, user: newUser });
                }
            });
        }
    };

    me.updateUser = function (req, res, match) {
        logger.info("update user: ", req.query);
        var uid = req.query.id || clientHelper.cookie(req, res)[constants.cookie.userId];
        if (!req.query || !uid) {
            responseJson(res, { success: false, message: "id required" });
            return;
        }
        var user = {};
        if (req.query.name) user.name = req.query.name;
        if (!req.query.notip) user.ip = clientHelper.getIp(req).ip;
        userService.updateUser(uid, user, function (err, updateCount) {
            if (err || !updateCount) {
                logger.info("update failed.", err)
                responseJson(res, { success: false, count: updateCount })
            } else {
                responseJson(res, { success: true, count: updateCount });
            }
        });
    };

    return me;
};
