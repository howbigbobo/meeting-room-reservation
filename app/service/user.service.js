var db = require("../dao/dao").db();
var logger = require('../util/logger').getLogger("user.service");

module.exports = function () {
    var me = {};
    me.addUser = function (user, callback) {
        user.createDate = (new Date()).format();
        logger.info('add user=', user);
        db.users.insert(user, callback);
    };

    function encryptPwd(user) {
        if (user && user.password) user.password = "******";
    }

    me.getUserById = function (id, callback) {
        if (!id) return callback(null, null);
        logger.info('get user id=', id);
        db.users.findOne({ _id: id }, function (err, doc) {
            encryptPwd(doc);
            if (callback) callback(err, doc);
        });
    };

    me.getUserByPwd = function (name, pwd, callback) {
        if (!name || !pwd) return callback(null, null);
        logger.info('get user name,pwd=', name, pwd);
        db.users.findOne({ name: name, password: pwd }, function (err, doc) {
            encryptPwd(doc);
            if (callback) callback(err, doc);
        });
    };

    me.updateUser = function (id, user, callback) {
        logger.info('update user,id=' + id, user);
        db.users.update({ _id: id }, { $set: user }, callback);
    };

    me.findUser = function (user, callback) {
        user = user || {};
        db.users.find(user).sort({ name: 1 }).exec(callback);
    }

    me.deleteUser = function (id, callback) {
        if (!id) callback('id required');
        logger.info('delete user , id=', id);
        db.users.remove({ _id: id }, callback);
    }

    return me;
};
