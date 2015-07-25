'use strict';

/* Services */

var phonecatServices = angular.module('phonecatServices', ['ngResource']);

phonecatServices.factory('Phone', ['$resource',
  function($resource){
    return $resource('phones/:phoneId.json', {}, {
      query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
  }]);

  
var meetingRoomServices = angular.module('meetingRoomServices',['ngResource']);

meetingRoomServices.factory('UserService',['$resource',
	function($resource){
		return $resource('user/:name',{},{
			query:{method: 'GET', params:{name:""}}
		});
	}
]);