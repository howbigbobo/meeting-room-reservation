var UserManager = (function ($) {
	function list() {
		ajaxGet('/user/list', function (response) {
			var html = template('template-user-list', response);
			$('#user-table-body').html(html);
		});
	}
	function deleteUser(id) {
		if (!id) return;
		var conf = confirm('确认删除这个用户吗？');
		if (!conf) return;
		ajaxGet('/user/delete', { id: id }, function (response) {
			list();
		});
	}

	return {
		list: list,
		delete: deleteUser
	};
})(jQuery);