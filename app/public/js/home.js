var reservationTemplate;

$(function () {
    getUser();
    $('body').on('click', '#btn-sign-up', signup)
        .on('click', '.reservation-link', reservationLinkClick)
        .on('change', '#slt-interval', getReservationList);
});

function getUser() {
    ajaxGet('/user/get', null, function (user) {
        //var html = template('template-signup', {});
        //$('#main-container').html(html);
        //return;
        userCallback(user);
    });
}

function dateParam(param) {
    if (!param) {
        return {
            date: $.trim($('#txt-date').val()) || '',
            interval: $('#slt-interval').val() || 60
        }
    } else {
        $('#txt-date').val(param.date);
        $('#slt-interval').val(param.interval);
    }
}

function compileReservationTemplate() {
    var html = $('#template-reservation').html();
    return template.compile(html);
}

function getReservationList() {
    var param = dateParam();
    ajaxGet('/reservation/list', param, function (response) {
        if (response && response.success && response.reservations) {
            reservationTemplate = reservationTemplate || compileReservationTemplate();
            var html = reservationTemplate(response.reservations);
            $('#room-reservation-list').html(html);
            setToolTip();
        } else if (response && response.message) {
            alert(response.message);
        }
    });
}

function userCallback(user) {
    if (user && user.name) {
        $('#userName').text(user.name);
        $('#main-container-reservation').show();
        $('#main-container').hide();
        initDateTimePicker();
        getReservationList();
    } else {
        $('#main-container-reservation').hide();
        $('#main-container').show();
        var html = template('template-signup', {});
        $('#main-container').html(html);
    }
}

function initDateTimePicker() {
    dateParam({date: (new Date()).format('yyyy-MM-dd'), interval: 60});
    $('#txt-date').datetimepicker({
        timepicker: false,
        format: 'Y-m-d',
        formatDate: 'Y-m-d',
        onSelectDate: function () {
            getReservationList();
        }
    });
}

function setToolTip() {
    $('.reservation-link.reserved').tooltip({
        html: true,
        placement: 'right',
        title: function () {
            return $(this).next('.tip-reservation').html()
        }
    });
}

function signup() {
    var name = $.trim($('#binding-name').val());
    if (name) {
        ajaxGet('/user/add?name=' + name, {}, function (res) {
            if (res && res.success) {
                userCallback(res.user);
            }
        });
    }
}

function reservationLinkClick() {
    var _this = $(this);
    if (!_this.attr('enable')) {
        return;
    }
    if (_this.attr('isReserved')) {
        if (!_this.attr('canRevert')) return;
        Reservation.remove(_this.attr('reservationId'));
    } else {
        var param = dateParam();
        Reservation.add(_this.attr('roomId'), param.date, _this.attr('start'), _this.attr('end'));
    }
}

var Reservation = (function reservation() {
    return {
        add: function (roomId, date, start, end) {
            ajaxGet('/reservation/add', {roomId: roomId, date: date, start: start, end: end}, function (res) {
                if (res && res.success) {
                    getReservationList();
                } else if (res && res.message) {
                    alert(res.message);
                }
            });
        },
        remove: function (reservationId) {
            ajaxGet('/reservation/delete', {id: reservationId}, function (res) {
                if (res && res.success) {
                    getReservationList();
                } else if (res && res.message) {
                    alert(res.message);
                }
            });
        }
    }
})();