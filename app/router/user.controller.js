var session = require('express-session');

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
        var name = req.query.name;
        var password = req.query.password;
        if (!name || !password) {
            responseJson(res, { success: false, message: "name and password are required." });
            return;
        }

        userService.getUserByPwd(name, password, function (err, user) {
            if (err) {
                logger.error('login error: ', err);
                responseJson(res, { success: false, message: "error." });
                return;
            }
            if (user && user.name && user.password) {
                req.session[constants.session.isLogin] = true;
                responseJson(res, { success: true, message: "login success" });
            } else {
                logger.info('login failed. name=', name, 'pwd=', password);
                responseJson(res, { success: false, message: "name or password is not correct." });
            }
        });
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
            userService.getUserByName(user.name, function (err, exist) {
                if (err) {
                    logger.error('get user name error.' + user.name, err);
                    responseJson(res, { success: false, message: 'error.' + err })
                } else if (exist) {
                    responseJson(res, { success: false, message: 'user name ' + user.name + ' is exists.' })
                } else {
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
            });
        }
    };

    me.updateUser = function (req, res) {
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

    me.findUser = function (req, res) {
        logger.info('find user');
        userService.findUser({}, function (err, rows) {
            if (err) {
                logger.error('find user error,', err);
                responseJson(res, { success: false });
            } else {
                responseJson(res, { success: true, users: rows });
            }
        });
    }

    me.deleteUser = function (req, res) {
        var id = req.query.id;
        if (!id) {
            responseJson(res, { success: false, message: 'id required' });
            return;
        }
        userService.deleteUser(id, function (err, count) {
            if (err) {
                logger.error('delete user error,', err);
                responseJson(res, { success: false });
            } else {
                responseJson(res, { success: true, count: count });
            }
        });
    }

    return me;
};
