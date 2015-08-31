var path = require('path');
var express = require('express');
var template = require('art-template');
var app = express();

var userController = require('./router/user.controller')();
var roomController = require('./router/room.controller')();
var reservationController = require('./router/reservation.controller')();

//template
template.config('extname', '');
template.config('openTag', '<%');
template.config('closeTag', '%>');

app.engine('htm', template.__express);
app.set('view engine', 'htm');

app.use(express.static('public'));

//router

//user
app.get("/user/get", userController.getUser);
app.get("/user/login/", userController.login);
app.get("/user/add", userController.addUser);
app.get("/user/update", userController.updateUser);

//room
app.get("/room/add", roomController.addRoom);
app.get("/room/update", roomController.updateRoom);
app.get("/room/delete", roomController.deleteRoom);
app.get("/room/allActive", roomController.allActiveRooms);
app.get("/room/all", roomController.allRooms);

//reservation
app.get("/reservation/add", reservationController.addReservation);
app.get("/reservation/delete", reservationController.deleteReservation);
app.get("/reservation/date", reservationController.findByDate);
app.get("/reservation/list", reservationController.listReservation);

//test
app.get("/index", function (req, res) {
	res.render('index.htm', {});
});

//test
app.get("/admin", function (req, res) {
	res.render('admin.htm', {});
});

app.listen(9999, function () {
	console.log('listening...' + 9999);
});