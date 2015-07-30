var util = require('util');
exports.getLogger = function (name) {
    var me = {};
    me.name = name;
    me.info = function (msg) {
        util.log(me.name + ": " + msg);
    };
    return me;
};