var reservationTemplate;

$(function () {
    getUser();
    $('body').on('click', '#btn-sign-up', signup)
        .on('click', '.reservation-link', reservationLinkClick);
});

function getUser() {
    ajaxGet('/user/get', null, function (user) {
        //var html = template('template-signup', {});
        //$('#main-container').html(html);
        //return;
        userCallback(user);
    });
}

function complieReservationTemplate() {
    var html = $('#template-reservation').html();
    return template.compile(html);
}

function getReservationList() {
    ajaxGet('/reservation/list', {}, function (response) {
        if (response && response.success && response.reservations) {
            reservationTemplate = reservationTemplate || complieReservationTemplate();
            var html = reservationTemplate(response.reservations);
            $('#main-container').html(html);
        } else if (response && response.message) {
            alert(response.message);
        }
    });
}

function userCallback(user) {
    if (user && user.name) {
        $('#userName').text(user.name);
        getReservationList();
    } else {
        var html = template('template-signup', {});
        $('#main-container').html(html);
    }
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
        var date = '' || (new Date()).toString();
        Reservation.add(_this.attr('roomId'), date, _this.attr('start'), _this.attr('end'));
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