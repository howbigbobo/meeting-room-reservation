var path = require('path');
var express = require('express');
var session = require('express-session')
var template = require('art-template');
var app = express();
var logger = require('./util/logger').getLogger('app.js');

var userController = require('./router/user.controller')();
var roomController = require('./router/room.controller')();
var reservationController = require('./router/reservation.controller')();
var constants = require('./constants');
var FilterRegister = require('./router/FilterRegister');
var adminLoginRequire = FilterRegister.get(constants.filter.adminLoginFilter);
adminLoginRequire.registe('/admin');

//template
template.config('extname', '');
template.config('openTag', '<%');
template.config('closeTag', '%>');

app.engine('htm', template.__express);
app.set('view engine', 'htm');

app.use(express.static('public'));
app.use(logger.connectLogger());

//session 
app.use(session({
  secret: 'abcdefghijklm0123456789nopqrstuvwxyz',
  resave: false,
  saveUninitialized: false
}));

//admin login filter.
app.use(function (req, res, next) {
  if (adminLoginRequire.contains(req.path)) {
    var isLogin = req.session[constants.session.isLogin];

    if (!isLogin) {
      res.redirect('/admin/login');
      return;
    }
  }
  if (next) next();
});

//router

//user
app.get("/user/get", userController.getUser);
app.get("/user/login", userController.login);
app.get("/user/add", userController.addUser);
app.get("/user/update", userController.updateUser);
app.get("/user/list", userController.findUser);
app.get("/user/delete", userController.deleteUser);

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

//index
app.get("/index", function (req, res) {
  res.render('index.htm', {});
});

//admin
app.get("/admin", function (req, res) {
  res.render('admin.htm', {});
});

app.get("/admin/login", function (req, res) {
  res.render('admin.login.htm', {});
});


var port = 5678;
if (process.argv.length > 2) port = process.argv[2] || port;
app.listen(port, function () {
  logger.info('server started, port = ' + port);
  console.log('server started, port = ' + port);
});