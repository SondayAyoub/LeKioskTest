var app = angular.module('main', ['ngRoute']);

app.config(function($routeProvider){
	$routeProvider.when('/',{
		templateUrl: '../../views/index.html',
		controller: 'homeCtrl'
	}).when('/login',{
		templateUrl: './layouts/login.html',
		controller: 'loginCtrl'
	}).when('/register',{
		templateUrl: './layouts/register.html',
		controller: 'registerCtrl'
	}).when('/profile',{
		templateUrl: './layouts/profile.html',
		controller: 'profileCtrl'
	}).otherwise({
		template: '404'
	})
});

app.service('user', function(){
	var username;
	var loggedin = false;
	this.setName = function(name){
		username = name;
	};

	this.getName = function(){
		return username;
	};

	this.isLoggedIn = function(){
		return loggedin;
	};

	this.userLoggedIn = function(){
		loggedin = true;
	};

})

app.controller('homeCtrl', function($scope, $location){
	$scope.goToLogin = function(){
		$location.path('/login');
	};

	$scope.register = function(){
		$location.path('/register');
	};
});

app.controller('loginCtrl', function($scope, $http, $location, user){
	$scope.login = function(){
		var username = $scope.username;
		var password = $scope.password;

		$http({
			url: 'http://localhost/angulartest/server.app',
			method: 'POST',
			header: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			date: 'username='+username+'&password='+password
		}).then(function(res){
			console.log(res.data);
			if(res.data.status == 'loggedin'){
				user.userLoggedIn();
				user.setName(res.data.user);
				$location.path('/profile');
			}
			else{
				alert('Invalid Login');
			}
		})

	}

});

app.controller('registerCtrl', function($scope, $http, $location){
	
});

app.controller('profileCtrl', function($scope, $http, $location, user){
	$scope.user = user.getName();
});