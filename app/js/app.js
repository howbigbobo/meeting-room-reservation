'use strict';

/* App Module */

var phonecatApp = angular.module('phonecatApp', [
  'ngRoute',
  'phonecatAnimations',

  'phonecatControllers',
  'phonecatFilters',
  'phonecatServices'
]);

phonecatApp.user = {id:0, name:""};

phonecatApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/phones', {
        templateUrl: 'partials/phone-list.html',
        controller: 'PhoneListCtrl'
      }).
      when('/phones/:phoneId', {
        templateUrl: 'partials/phone-detail.html',
        controller: 'PhoneDetailCtrl'
      }).
	  when('/meeting-room-reservation', {
        templateUrl: 'partials/meeting-room-reservation.html',
        controller: 'MeetingRoomreservation'
      }).
      otherwise({
        redirectTo: '/phones'
      });
  }]);

/*=============================*/
  
var meetingRoom = angular.module('meetingRoom',['ngRoute',"meetingRoomControllers","meetingRoomServices"]);
meetingRoom.config(['$routeProvider',
	function($routeProvider) {
    $routeProvider.
      when('/home', {
	    //templateUrl: 'partials/home.html',
        controller: 'Home'
      }).
      when('/sign-up', {
        templateUrl: 'partials/sign-up.html',
        controller: 'SignUp'
      }).
	  when('/meeting-room', {
        templateUrl: 'partials/meeting-room.html',
        controller: 'MeetingRoomHome'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }
]);