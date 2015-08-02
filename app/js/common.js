function ajaxGet(url, param, success) {
    $.ajax({
        url: url,
        data: param,
        type: 'get',
        dataType: 'json',
        success: success
    });
}