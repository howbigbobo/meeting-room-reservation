var ReservationManager = (function ($) {
	function list() {
		var date = $('#txt-reservation-date').val();
		ajaxGet('/reservation/date', { date: date }, function (response) {
			var html = template('template-reservation-list', response);
			$('#reservation-table-body').html(html);
		});
	}
	function deleteUser(id) {
		if (!id) return;
		var conf = confirm('确认删除这条预定记录吗？');
		if (!conf) return;
		ajaxGet('/reservation/delete', { id: id }, function (response) {
			list();
		});
	}

	return {
		list: list,
		delete: deleteUser
	};
})(jQuery);

$(function () {
	function initDateTimePicker() {
		$('#txt-reservation-date').val((new Date()).format('yyyy-MM-dd'));
		$('#txt-reservation-date').datetimepicker({
			timepicker: false,
			format: 'Y-m-d',
			formatDate: 'Y-m-d',
			onSelectDate: function () {
				ReservationManager.list();
			}
		});
	}
	initDateTimePicker();
});

function changeDay(op) {
	op = op * 1.0;
	var dateVal = $('#txt-reservation-date').val();
	var date = new Date(dateVal);
	var day = new Date(date.getTime() + (24 * 60 * 60 * 1000) * op);
	$('#txt-reservation-date').val(day.format('yyyy-MM-dd'));
	ReservationManager.list();
}
