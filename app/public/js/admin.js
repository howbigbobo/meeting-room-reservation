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
});

function login(){
	var name = $.trim($('#txt-name').val());
	var pwd = $('#txt-pwd').val();
	if(!name) {
		alert('请输入用户名');
		return;
	}
	if(!pwd){
		alert('请输入密码');
		return;
	}
	ajaxGet('',{name:name,pwd:pwd},function(response){
		
	});
}