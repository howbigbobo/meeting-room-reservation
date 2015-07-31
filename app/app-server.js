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
server.get("/room/add", controller.getUser);
server.get("/room/update", controller.getUser);
server.get("/room/delete", controller.getUser);
server.get("/room/all", controller.getUser);

//reservation
server.get("/reservation/add", controller.getUser);
server.get("/reservation/delete", controller.getUser);
server.get("/reservation/list", controller.getUser);

server.listen(8080);