var util = require('util');
exports.getLogger = function (name) {
    var me = {};
    me.name = name;
    me.debug = function (msg) {
        var ss = me.name + "[debug]: ";
        ss += util.format(arguments);
        util.log(ss);
    };
    me.info = function () {
        var ss = me.name + "[info]: ";
        ss += util.format(arguments);
        util.log(ss);
    };
    
    me.warn = function () {
        var ss = me.name + "[warn]: ";
        ss += util.format(arguments);
        util.log(ss);
    };
    
    me.warn = function () {
        var ss = me.name + "[error]: ";
        ss += util.format(arguments);
        util.log(ss);
    };
    return me;
};