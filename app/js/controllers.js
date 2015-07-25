'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('PhoneListCtrl', ['$scope', 'Phone',
  function($scope, Phone) {
    $scope.phones = Phone.query();
    $scope.orderProp = 'age';
  }]);

phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
  function($scope, $routeParams, Phone) {
    $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
      $scope.mainImageUrl = phone.images[0];
    });

    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    };
  }]);
  
phonecatControllers.controller('MeetingRoomreservation', ['$scope', 'Phone',
  function($scope, Phone) {
    $scope.phones = Phone.query();
    $scope.orderProp = 'age';
  }]);

  /*============================*/
var meetingRoomControllers = angular.module('meetingRoomControllers',[]);

meetingRoomControllers.controller('Home',['$scope', '$routeParams', '$location', 'UserService',
	function($scope,$routeParams,$location,UserService){
		var user ={id:0,name:"bowen"};// UserService.query();
		$scope.user = user;
		if(!user || !user.id){
			$location.path('sign-up');
		}else{
			$location.path('meeting-room');
		}
	}
]);

meetingRoomControllers.controller('SignUp',['$scope', '$routeParams', 'UserService',
	function($scope,$routeParams,UserService){
		
	}
]);

meetingRoomControllers.controller('DoSignUp',['$scope', '$routeParams', 'UserService',
	function($scope,$routeParams,UserService){
		$scope.signup = function(){
			console.log($scope.bindingName);
		}
}]);

meetingRoomControllers.controller('MeetingRoomHome',['$scope', '$routeParams', 'UserService',
	function($scope,$routeParams,UserService){
		
	}
]);