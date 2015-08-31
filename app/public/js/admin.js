$(function () {
	initTab();
	RoomManager.list();
});

function initTab() {
	$('#adminTab a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	})
}

var RoomManager = (function ($) {

	var cacheRooms = [];
	function getRoom(id) {
		if (!id) return null;
		if (!cacheRooms || cacheRooms.length == 0) return null;
		for (var i = 0; i < cacheRooms.length; i++) {
			if (cacheRooms[i]._id == id) return cacheRooms[i];
		}
		return null;
	}

    function listRoom() {
		ajaxGet('/room/all', function (response) {
			cacheRooms = response.rooms;
			var html = template('template-room-list', response);
			$('#room-table-body').html(html);
		});
	}

	function update(room) {
		ajaxGet('/room/update', room, function (response) {
			listRoom();
		});
	}

	function enable(id) {
		update({ id: id, status: 'A' });
	}

	function disable(id) {
		update({ id: id, status: 'D' });
	}

	function deleteRoom(id) {
		var conf = confirm("确认删除（不可恢复）这个会议室吗？");
		if (!conf) return;
		ajaxGet('/room/delete', { id: id }, function (response) {
			listRoom();
		});
	}

	function edit(id) {
		var room = getRoom(id) || {};
		console.log(id);
		console.log(room);
		if (!id) {
			$('#room-edit-modal-title').html('会议室-新增');
		} else {
			$('#room-edit-modal-title').html('会议室-编辑');
		}
		var html = template('template-room-edit', room);
		console.log(html);
		$('#room-edit-modal-body').html(html);
		$('#room-edit-modal').modal();
	}

	return {
		list: listRoom,
		enable: enable,
		disable: disable,
		delete: deleteRoom,
		edit: edit
	}
})(jQuery);