//var server = require('../node_modules/node-router/lib/node-router').getServer();
var server = require('node-router').getServer();

var userService = require('./node/user-service').userService();

/*
server.get("/json", function (req, res, match) {
  return {hello: "World"};
});

server.get(new RegExp("^/(.*)$"), function hello(req, res, match) {
  return "Hello " + (match || "World") + "!";
});
*/

server.get("/hello",function(req,res,match){
	userService.add('bowen','1','1');
	userService.add('bowen2','2','2');
	userService.all(function(err,rows){
		if(err) console.log(err);
		else{
			if(rows && rows.length > 0){
				for(var i = 0;i < rows.length; i++){
					console.log(rows[i]);
				}
			}
		}
	});
	return {hello: "World"};
});

server.listen(8080);