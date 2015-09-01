var path = require('path');
var logger = require("../util/logger").getLogger("dao");
var DataStore = require('nedb');

var dbDir = path.normalize(__dirname + '/../data');
var db = db || {};

exports.db = function () {
    if (db.initial) {
        return db;
    }
    db.initial = true;

    db.users = new DataStore({ filename: dbDir + '/users.nedb', autoload: true });
    db.users.loadDatabase(function (err) {
        logger.info('db.users loaded.', err);
    });

    db.rooms = new DataStore({ filename: dbDir + '/rooms.nedb', autoload: true });
    db.rooms.loadDatabase(function (err) {
        logger.info('db.rooms loaded.', err);
    });

    db.reservations = new DataStore({ filename: dbDir + '/reservations.nedb', autoload: true });
    db.reservations.loadDatabase(function (err) {
        logger.info('db.reservations loaded.', err);
    });
    db.reservations.ensureIndex({ fieldName: 'date', unique: false }, function (err) {
        logger.info('db.reservations.dateIndex created', err);
    });

    return db;
};