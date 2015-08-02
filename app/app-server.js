//var server = require('../node_modules/node-router/lib/node-router').getServer();
var server = require('node-router').getServer();
var controller = require("./node/controller").controller();

/*
 server.get("/json", function (req, res, match) {
 return {hello: "World"};
 });

 server.get(new RegExp("^/(.*)$"), function hello(req, res, match) {
 return "Hello " + (match || "World") + "!";
 });
 */

//user
server.get("/user/get", controller.getUser);
server.get("/user/login/", controller.login);
server.get("/user/add", controller.addUser);
server.get("/user/update", controller.updateUser);

//room
server.get("/room/add", controller.addRoom);
server.get("/room/update", controller.updateRoom);
server.get("/room/delete", controller.deleteRoom);
server.get("/room/all", controller.allRoom);

//reservation
server.get("/reservation/add", controller.addReservation);
server.get("/reservation/delete", controller.deleteReservation);
server.get("/reservation/date", controller.findByDate);
server.get("/reservation/list", controller.listReservation);

server.listen(8080);