var reservationTemplate;
var reservationsCache;

$(function () {
    getUser();
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
            date: $.trim($('#txt-date').val()) || ''
        }
    } else {
        $('#txt-date').val(param.date);
    }
}

function compileReservationTemplate() {
    var html = $('#template-reservation-bar').html();
    return template.compile(html);
}

function getReservationList() {
    var param = dateParam();
    ajaxGet('/reservation/list', param, function (response) {
        if (response && response.success && response.reservations) {
            reservationTemplate = reservationTemplate || compileReservationTemplate();
            response.showReserveButton = isToday(param.date) || afterToday(param.date);
            var html = reservationTemplate(response);
            reservationsCache = response.reservations;
            $('#room-reservation-list').html(html);
            initReserveBar(response.reservations);
        } else if (response && response.message) {
            alert(response.message);
            reservationsCache = [];
        }
    });
}

function afterToday(date) {
    return date > (new Date()).format('yyyy-MM-dd')
}

function isToday(date) {
    return date == (new Date()).format('yyyy-MM-dd')
}

function initReserveBar(reservations) {
    $('.room-reserve-bar').each(function (i, e) {
        var roomId = $(e).attr('roomId');
        var bars = [];
        var minStart = 9 * 60;
        var maxEnd = 18 * 60;
        for (var i = 0; i < reservations.length; i++) {
            var res = reservations[i];
            if (res.room._id !== roomId) continue;
            if (!res.reservations) continue;

            var lastEnd = 9 * 60;
            for (var j = 0; j < res.reservations.length; j++) {
                var re = res.reservations[j];
                if (re.startMinute < minStart) minStart = re.startMinute;
                if (re.endMinute > maxEnd) maxEnd = re.endMinute;

                if (re.startMinute > lastEnd + 1) {
                    bars.push({
                        start: lastEnd,
                        end: re.startMinute,
                        enable: re.enable,
                        reserved: false,
                        data: null
                    });
                }
                bars.push({
                    start: re.startMinute,
                    end: re.endMinute,
                    enable: re.enable,
                    reserved: true,
                    canRevert: re.canRevert,
                    currentUser: re.currentUser,
                    data: re,
                    user: re.userName
                });
                lastEnd = re.endMinute;
            }
        }
        $(e).splitBar({ bars: bars, start: minStart, end: maxEnd });
    });

    initToolTip();
    initDelete();
}

function initToolTip() {
    $('.room-reserve-bar').each(function (i, e) {
        var placement = i == 0 ? 'bottom' : 'top';
        $(e).find('.c-split-bar span[bar-index]').tooltip({
            html: true,
            placement: placement,
            title: function () {
                var barData = $(this).parents('.room-reserve-bar').data('bar-data')[$(this).attr('bar-index')];
                if (barData) {
                    return template('template-reservation-tooltip', barData);
                }
            }
        });
    });
}

function initDelete() {
    $('.room-reserve-bar .c-split-bar .canRevert').click(function () {
        var barData = $(this).parents('.room-reserve-bar').data('bar-data')[$(this).attr('bar-index')];
        if (!barData || !barData.canRevert) return;
        var cnf = confirm('确认取消预订吗？');
        if (cnf) {
            Reservation.remove(barData._id);
        }
    });
}

function userCallback(user) {
    if (user && user.name && !user.getByIp) {
        $('#userName').text(user.name);
        $('#main-container-reservation').show();
        $('#main-container').hide();
        initDateTimePicker();
        getReservationList();
        listenEnter(false);
    } else {
        $('#main-container-reservation').hide();
        $('#main-container').show();
        var html = template('template-signup', {});
        $('#main-container').html(html);
        $('#binding-name').val(user && user.name ? user.name : '');
        getIp();
        listenEnter(true);
    }
}

function listenEnter(listen) {
    $(document).off('keydown.confirm');
    if (!listen) {
        return;
    }
    $(document).on('keydown.confirm', function (e) {
        if (e && e.keyCode && e.keyCode == 13) {
            signup();
        }
    });
}

function getIp() {
    ajaxGet('/ip', function (response) {
        $('#ip-text').text(response.ip);
    });
}

function initDateTimePicker() {
    dateParam({ date: (new Date()).format('yyyy-MM-dd'), interval: 60 });
    $('#txt-date').datetimepicker({
        timepicker: false,
        format: 'Y-m-d',
        formatDate: 'Y-m-d',
        onSelectDate: function () {
            getReservationList();
        }
    });
}

function signup() {
    var name = $.trim($('#binding-name').val());
    console.log(name);
    if (name) {
        ajaxGet('/user/add?name=' + name, {}, function (res) {
            if (res && res.success) {
                userCallback(res.user);
            } else if (res.message) {
                alert(res.message);
            }
        });
    }
}


var Reservation = (function reservation() {
    return {
        add: function (roomId, date, start, end, comment) {
            ajaxGet('/reservation/add', { roomId: roomId, date: date, start: start, end: end, comment: comment }, function (res) {
                if (res && res.success) {
                    $('#reservation-add-modal').modal('hide');
                    alert('预订成功！ （点击你的预订记录可以取消预订）');
                } else if (res && res.message) {
                    var msg = res.message;
                    if (res.message == "reservation exist." && res.reservation) {
                        msg = textFormat(res.reservation.startMinute) + '-' + textFormat(res.reservation.endMinute);
                        msg += ",会议室(" + res.reservation.roomName + ")已经被";
                        msg += res.reservation.userName + "预订";
                    }
                    alert(msg);
                }
                getReservationList();
            });
        },
        remove: function (reservationId) {
            ajaxGet('/reservation/delete', { id: reservationId }, function (res) {
                if (res && res.success) {
                    alert('取消预订成功');
                } else if (res && res.message) {
                    alert(res.message);
                }
                getReservationList();
            });
        }
    }
})();

function openReserve(roomId) {
    if (!roomId || !reservationsCache) return;
    for (var i = 0; i < reservationsCache.length; i++) {
        if (reservationsCache[i].room._id == roomId) {
            var html = template('template-reservation-add', { room: reservationsCache[i].room, date: dateParam().date });
            $('#reservation-add-modal-body').html(html);
            $('#reservation-add-modal').modal();
            function getTime(time) {
                var hour = time.getHours();
                var minute = time.getMinutes() >= 30 ? 30 : 0;
                return (hour < 10 ? '0' : '') + hour + ":" + (minute < 10 ? '0' : '') + minute;
            }
            function initTimePicker() {
                var opt = {
                    datepicker: false,
                    format: 'H:i',
                    step: 30
                };
                var nowTime = getTime(new Date());
                opt.minTime = isToday(dateParam().date) ? nowTime : '9:00';
                opt.maxTime = nowTime > "18:30" ? nowTime : "18:30";

                $('#txt-reserve-end').datetimepicker(opt);

                var optStart = $.extend({}, opt, true);
                optStart.onChangeDateTime = function (dp, $input) {
                    var time = getTime(new Date(dp));
                    opt.minTime = time;
                    opt.maxTime = time > "18:30" ? time : "18:30";
                    $('#txt-reserve-end').datetimepicker(opt);
                };
                $('#txt-reserve-start').datetimepicker(optStart);
            }

            initTimePicker();
            break;
        }
    }
}

function addReserve() {
    var start = $('#txt-reserve-start').val();
    var end = $('#txt-reserve-end').val();
    if (!start || !end) {
        $('#reserve-add-errorMessage').html("请输入会议开始和结束时间");
        return;
    }
    function getMinuteInay(time) {
        var xx = time.split(':');
        if (xx.length < 2) return 0;
        return Number(xx[0]) * 60 + Number(xx[1]);
    }

    Reservation.add($('#txt-reserve-roomId').val(), $('#txt-reserve-date').val(), getMinuteInay(start), getMinuteInay(end), $('#txt-reserve-comment').val());
}

function textFormat(value) {
    var hour = parseInt(value / 60);
    var minute = value % 60
    return (hour > 9 ? '' + hour : '0' + hour) + ':' + (minute > 9 ? '' + minute : '0' + minute);
}