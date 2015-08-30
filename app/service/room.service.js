var db = require("../dao/dao").db();
var logger = require('../util/logger').getLogger("room.service");

module.exports = function () {
    var me = {};

    me.addRoom = function (room, callback) {
        room.status = 'A';
        room.createDate = (new Date()).format();
        logger.info('add room = ', room);
        db.rooms.insert(room, callback);
    };

    me.updateRoom = function (id, room, callback) {
        room.updateDate = (new Date()).format();
        logger.info('update room = ', room, ' id=', id);
        db.rooms.update({_id: id}, {$set: room}, callback);
    };

    me.getRoomById = function (id, callback) {
        logger.info('find room, id =', id);
        db.rooms.findOne({_id: id, status: 'A'}, callback);
    };

    me.allRooms = function (callback) {
        db.rooms.find({}, callback);
    };
    
     me.allActiveRooms = function (callback) {
        db.rooms.find({status: 'A'}, callback);
    };

    return me;
};
