var PwdManager = (function ($) {
	function changepwd() {
		var oldPwd = $('#txt-pwd-old').val();
		var newPwd = $('#txt-pwd-new').val();
		var newPwdr = $('#txt-pwd-new-r').val();
		if (!oldPwd) {
			alert('请输入旧密码');
			return false;
		}
		if (!newPwd) {
			alert('请输入新密码');
			return false;
		}
		if (!newPwdr) {
			alert('请再输入新密码');
			return false;
		}
		if (newPwd != newPwdr) {
			alert('两次新密码输入不一致');
			return false;
		}
		if (newPwd.length < 6) {
			alert('请输入不少于6位的新密码');
			return false;
		}

		ajaxGet('/admin/pwd', { old: oldPwd, 'new': newPwd }, function (response) {
			if (response && response.success) {
				alert('修改成功');
				resetpwd();
			} else {
				alert(response.message);
			}
		});
	}

	function resetpwd() {
		$('#change-password-form input').val('');
	}

	return {
		changepwd: changepwd,
		resetpwd: resetpwd
	};
})(jQuery);