var log4js = require('log4js');
log4js.configure(__dirname + '/../config/log4js.json');
exports.getLogger = function (name) {
    function formatLog() {
        var log = [];
        for (var i = 0; i < arguments.length; i++) {
            var obj = arguments[i];
            if (typeof (obj) === "object") log.push(JSON.stringify(obj));
            else log.push(obj);
        }
        return log.join(' ');
    }
    var logger = log4js.getLogger(name);
    var me = {};
    me.debug = function (msg) {
        var ss = formatLog(arguments);
        logger.debug(ss);
    };
    me.info = function () {
        var ss = formatLog(arguments);
        logger.info(ss);
    };

    me.warn = function () {
        var ss = formatLog(arguments);
        logger.warn(ss);
    };

    me.error = function () {
        var ss = formatLog(arguments);
        logger.error(ss);
    };

    me.connectLogger = function () {
        return log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' });
    };
    return me;
};