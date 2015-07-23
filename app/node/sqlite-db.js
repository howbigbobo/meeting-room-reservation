//数据库接口库
var util = require('util');
var fs = require('fs');
var sqlite3 = require('sqlite3');

var dbFile = "./data/meeting-room.db";

sqlite3.verbose();
var db = undefined;

/*
 数据库名是直接硬编码的，所以当调用connect和setup函数时，当前目录中就会生成chap06.sqlite3文件
 */
 
 function getCreateSql(){
	var arr = [];
	arr.push('Create table if not exists user ');
	arr.push('(');
    arr.push('id    		    INTEGER primary key AUTOINCREMENT,');
    arr.push('name    	    TEXT,');
	arr.push('password        TEXT,');
    arr.push('ip		        TEXT,');
    arr.push('mac             TEXT,');
    arr.push('createDate      TEXT,');
    arr.push('updateDate      TEXT');
	arr.push(')');
	return arr.join(' ');
 }

exports.connect = function(callback){
	if(db) return db;
	
   innerConnect(function(err){
		if(!err){
			setup();
		}
   });
	
	return db;
}

function innerConnect(callback) {
  db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
        function(err){
            if (err){
                util.log('FAIL on creating database ' + err);
                if(callback) callback(err);
            } else {
                if(callback) callback(null);
            }
        });
}

function setup(callback) {
	return;
	db.run(getCreateSql(),
				function(err){
					if (err){
						util.log('FAIL on creating table ' + err);
						if(callback) callback(err);
					} else {
						if(callback) callback(null);
					}
				});
}

//此处的disconnect函数是空的
exports.disconnect = function(callback){
    callback(null);
}