var path = require('path');
var express = require('express');
var template = require('art-template');
var app = express();

var userController = require('./router/user.controller')();
var roomController = require('./router/room.controller')();
var reservationController =  require('./router/reservation.controller')();

//template
template.config('extname','');
app.engine('htm',template.__express);
app.set('view engine','htm');

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
app.get("/room/all", roomController.allActiveRooms);

//reservation
app.get("/reservation/add", reservationController.addReservation);
app.get("/reservation/delete", reservationController.deleteReservation);
app.get("/reservation/date", reservationController.findByDate);
app.get("/reservation/list", reservationController.listReservation);



app.listen(8000,function(){
	console.log('listening...');
});