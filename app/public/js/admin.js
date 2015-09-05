$(function () {
	if ($('#adminTab').length > 0) {
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
	}

	if ($('#admin-login-form').length > 0) {
		document.onkeydown = function (e) {
			var ev = document.all ? window.event : e;
			if (ev.keyCode == 13) {
				login();
			}
		}
	};  
	
});

function login() {
	var name = $.trim($('#txt-name').val());
	var pwd = $('#txt-pwd').val();
	if (!name) {
		$('#login-message').html('请输入用户名');
		return;
	}
	if (!pwd) {
		$('#login-message').html('请输入密码');
		return;
	}
	$('#login-message').html('');
	ajaxGet('/user/login', { name: name, password: pwd }, function (response) {
		if (response && response.success) {
			location.href = "/admin";
		} else if (response.message) {
			$('#login-message').html(response.message);
		}
	});
}