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
var fs = require('fs');
console.log(controller);
server.get("/user/get", function (req, res, match) {
   var obj = controller.getUser(req,res,match);
    console.log(obj);
    return {};
});
server.get("/user/login/", controller.login);
server.get("/user/add", controller.addUser);

server.get("/user/get1", function (req, res, match) {
    return {user: 1};
});

server.listen(8080);