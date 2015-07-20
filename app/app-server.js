var server = require('../node_modules/node-router/lib/node-router').getServer();
var staticHandler = new require('../node_modules/node-router/lib/node-router').staticHandler("/","");
/*
server.get("/json", function (req, res, match) {
  return {hello: "World"};
});

server.get(new RegExp("^/(.*)$"), function hello(req, res, match) {
  return "Hello " + (match || "World") + "!";
});
*/
server.get(new RegExp("/\.(html|js|css|htm|jpg|jpeg|png|gif)/"),staticHandler);

server.listen(8080);