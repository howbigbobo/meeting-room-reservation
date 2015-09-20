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
        isLocalHost: isLoopbackIp(ip)
    };
};

exports.cookie = function (req, res) {
    var cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function (cookie) {
        var parts = cookie.split('=');
        cookies[parts[0].trim()] = ( parts[1] || '' ).trim();
    });
    cookies.setCookie = function (name, value, expireSecond, path, domain) {
        var cookieStr = name + '=' + value + ';';
        if (expireSecond || expireSecond == 0) {
            expireSecond = parseInt(expireSecond);
            var time = (new Date()).getTime() + expireSecond * 1000;
            var newDate = new Date(time);
            cookieStr += 'expires=' + newDate.toUTCString() + ';';
        }
        if (path) {
            cookieStr += 'path=' + path + ';';
        }
        if (domain) {
            cookieStr += 'domain=' + domain + ';';
        }
        res.setHeader("Set-Cookie", cookieStr);
        return true;
    };
    return cookies;
};
