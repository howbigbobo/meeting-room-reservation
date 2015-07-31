var util = require('util');
exports.getLogger = function (name) {
    var me = {};
    me.name = name;
    me.info = function () {
        var ss = me.name + ": ";
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === "object") {
                ss += JSON.stringify(arguments[i]) + "; ";
            } else {
                ss += arguments[i] + "; "
            }
        }
        util.log(ss);
    };
    me.debug = function (msg) {
        util.log(me.name + ": ");
        util.log(msg);
    };
    return me;
};