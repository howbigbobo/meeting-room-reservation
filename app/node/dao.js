var util = require('util');
var db = require('./sqlite-db').connect();
//http://www.cnblogs.com/EricaMIN1987_IT/p/3654826.html
exports.dao = function() {
	
	function execute(sql,param,callback){
		db.run(sql, param,
			function(error){
				if (error){
				   util.log('FAIL on execute ' + error);
				   util.log(sql);
				   util.log(param);
				   if(callback) callback(error);
				} else {
				   if(callback) callback(null);
				}
			});
	};
	
	function add(table, obj, callback) {
		var ins = buildInsert(table, obj);
		execute(ins.sql, ins.param, callback);
	}
	
	function update(table, obj, whereObj, callback) {
		var ins = buildUpdate(table, obj, whereObj);
		execute(ins.sql, ins.param, callback);
	}
	
	function del(table, obj, callback) {
		var ins = buildDelete(table, obj);
		execute(ins.sql, ins.param, callback);
	}
	
	function find(table, obj, callback) {
		if(typeof(obj) === "function"){
			callback = obj;
		}
		var where = buildWhere(obj);
		db.all("SELECT * FROM " + table + " " + where.where, where.param, callback);
	}
	
	return {
		add : add,
		update : update,
		delete : del,
		find : find
	};
};

function buildInsert(table, obj) {
	var str1 = [];
	str1.push("INSERT INTO ");
	str1.push(table);
	str1.push('(');
	
	var str2 = [];
	var param = [];
	for(var pro in obj) {
		str1.push(pro);
		str1.push(',');
		str2.push('?');
		str2.push(',');
		param.push(obj[pro]);
	}
	str1.pop();
	str2.pop();
	str1.push(') VALUES (');
	str1.push(str2.join(''));
	str1.push(')');
	
	return {
		sql : str1.join(' '),
		param : param
	};
}

function buildUpdate(table, obj, whereObj) {
	var where = buildWhere(whereObj);
	var str1 = [];
	var param = [];
	str1.push("UPDATE " + table + " SET ");
	for(var pro in obj){
		str1.push(pro + '=? ');
		str1.push(',');
		param.push(obj[pro]);
	}
	str1.pop();
	str1.push(where.where);
	param = param.concat(where.param);
	return {
		sql : str1.join(' '),
		param : param
	}
}

function buildDelete(table, obj) {
	var str1 = [];
	str1.push("DELETE FROM " + table);
	var where = buildWhere(obj);
	str1.push(where.where);
	
	return {
		sql : str1.join(' '),
		param : where.param
	};
}

function buildWhere(obj){
	var result = {where:"",param:[]};
	if(!obj || typeof(obj) !== "object") return result;
	
	var str1 = [];
	str1.push(" WHERE ");
	var param = [];
	var hasProperty = false;
	for(var pro in obj) {
		str1.push(pro + '=?');
		str1.push(' AND ');
		param.push(obj[pro]);
		hasProperty = true;
	}
	if (hasProperty) {
		str1.pop();
		return {
			where : str1.join(''),
			param : param
		};
	}else{
		return result;
	}
}