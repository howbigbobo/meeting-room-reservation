var db = require('./sqlite-db').connect();
//http://www.cnblogs.com/EricaMIN1987_IT/p/3654826.html
exports.userService = function() {
	function add(name, ip, mac, callback) {
		db.run("INSERT INTO user (name, ip, mac, createDate) " +
        "VALUES (?, ?, ?,?);",
        [name, ip, mac, new Date()],
        function(error){
            if (error){
                util.log('FAIL on add ' + error);
               if(callback) callback(error);
            } else {
               if(callback) callback(null);
            }
        });
	}
	
	function all(callback) {
		db.all("SELECT * FROM user", callback);
	}
	
	return {
		add : add,
		all : all
	};
};

var User = function() {
	return {
		a:1
	};
};