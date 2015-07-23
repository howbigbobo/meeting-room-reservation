//var server = require('../node_modules/node-router/lib/node-router').getServer();
var server = require('node-router').getServer();
var dateTime = require('./node/date-time');
var dao = require('./node/dao').dao();

/*
server.get("/json", function (req, res, match) {
  return {hello: "World"};
});

server.get(new RegExp("^/(.*)$"), function hello(req, res, match) {
  return "Hello " + (match || "World") + "!";
});
*/

server.get("/hello",function(req,res,match){
	dao.add("user", {name:"bowen",ip:123,mac:2222,createDate :(new Date()).format()});
	dao.find("user",function(err,rows){
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