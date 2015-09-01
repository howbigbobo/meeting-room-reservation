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
		if (!id) {
			$('#room-edit-modal-title').html('会议室-新增');
		} else {
			$('#room-edit-modal-title').html('会议室-编辑');
		}
		var html = template('template-room-edit', room);
		$('#room-edit-modal-body').html(html);
		$('#room-edit-modal').modal();
	}

	function save() {
		var inputs = $('#room-form input[name]');
		var data = {};
		for (var i = 0; i < inputs.length; i++) {
			var input = $(inputs[i]);
			data[input.attr('name')] = input.val();
		}

		if (!data.name || !($.trim(data.name))) {
			alert('名称不能为空');
			return;
		}
		var url = !!data.id? "/room/update":"/room/add";
		ajaxGet(url,data,function(response){
			$('#room-edit-modal').modal('hide');
			listRoom();
		});
	}

	return {
		list: listRoom,
		enable: enable,
		disable: disable,
		delete: deleteRoom,
		edit: edit,
		add: edit,
		save: save
	}
})(jQuery);