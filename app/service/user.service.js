var crypto = require('crypto');
var salt = '-slt-b-151001';

var db = require("../dao/dao").db();
var logger = require('../util/logger').getLogger("user.service");

module.exports = function () {
    function encrypt(content) {
        content = content + salt;
        var shasum = crypto.createHash('sha1');
        shasum.update(content);
        return shasum.digest('hex');
    }

    var me = {};
    me.addUser = function (user, callback) {
        user.createDate = (new Date()).format();
        logger.info('add user=', user);
        db.users.insert(user, callback);
    };

    function vaguePwd(user) {
        if (user && user.password) user.password = "******";
    }

    me.getUserById = function (id, callback) {
        if (!id) return callback(null, null);
        logger.info('get user id=', id);
        db.users.findOne({ _id: id }, function (err, doc) {
            vaguePwd(doc);
            if (callback) callback(err, doc);
        });
    };

    me.getUserByPwd = function (name, pwd, callback) {
        if (!name || !pwd) return callback(null, null);
        pwd = encrypt(pwd);
        logger.info('get user name,pwd=', name, pwd);
        db.users.findOne({ name: name, password: pwd }, function (err, doc) {
            vaguePwd(doc);
            if (callback) callback(err, doc);
        });
    };

    me.updateUser = function (id, user, callback) {
        logger.info('update user,id=' + id, user);
        db.users.update({ _id: id }, { $set: user }, callback);
    };

    me.findUser = function (user, callback) {
        user = user || {};
        var cbk = function (err, rows) {
            var users = [];
            if (rows && rows.length > 0) {
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].name != "admin") users.push(rows[i]);
                    vaguePwd(rows[i]);
                }
            }

            if (callback) callback(err, users);
        };
        db.users.find(user).sort({ name: 1 }).exec(cbk);
    }

    me.deleteUser = function (id, callback) {
        if (!id) callback('id required');
        logger.info('delete user , id=', id);
        db.users.remove({ _id: id }, callback);
    }

    me.encryptPassword = encrypt;

    return me;
};
