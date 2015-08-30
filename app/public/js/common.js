function ajaxGet(url, param, success) {
    $.ajax({
        url: url,
        data: param,
        type: 'get',
        dataType: 'json',
        success: success
    });
}

Date.prototype.format = function (format) {
    var date = this;

    var map = {
        "M": date.getMonth() + 1, 
        "d": date.getDate(), 
        "h": date.getHours(), 
        "m": date.getMinutes(), 
        "s": date.getSeconds(), 
        "q": Math.floor((date.getMonth() + 3) / 3),
        "S": date.getMilliseconds() 
    };
    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
        var v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        }
        else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
};
