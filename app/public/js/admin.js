$(function () {
	RoomManager.list();

	$('#adminTab a[data-toggle="tab"]').on('click', function (e) {
		var activeTab = $(this);
		if (activeTab.data('init')) return;
		activeTab.data('init', true);

		switch (activeTab.attr('href')) {
			case "#userManage": UserManager.list(); break;
			case "#reservationManage": ReservationManager.list(); break;
		}
	});
});