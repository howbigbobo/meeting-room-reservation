exports.getIp = function (req) {
    var isLoopbackIp = function (ip) {
        var _ip = ip.toLowerCase().trim();
        return _ip === '127.0.0.1' || _ip === '::1';
    }

    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var mac = "";
    return {
        ip: ip,
        mac: mac,
        isLocalHost : isLoopbackIp(ip)
    };
};
