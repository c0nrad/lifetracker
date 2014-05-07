var app = angular.module('app', ['ngResource', 'ngRoute', 'ui.bootstrap'])

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl : 'partials/home.html',
      controller  : 'MainController'
    })

    .when('/entries', {
      templateUrl : 'partials/entries.html',
      controller  : 'EntriesController'
    })

    .when('/entry/:_id', {
      templateUrl : 'partials/entry.html', 
      controller  : 'EntryController' 
    })

    .when('/me', {
      templateUrl : 'partials/me.html',
      controller  : 'MeController'
    })
});

app.controller('MainController', function($scope) {
  $scope.title = "Home";
})

app.factory('Entry', function($resource) {
  return $resource( '/api/entries/:_id?sort=-timestamp', {_id: "@_id"}, {'update': { method:'PUT' } });
})


app.factory('Me', function($resource, $rootScope) {
  var Me = $resource('/me', {}, {'update': { method:'PUT' }})
  $rootScope.me = Me.get({}, function() {});
  return Me
})

app.controller('EntriesController', function($scope, Entry, $rootScope, $location) {

  $canMakeNew = false

  $rootScope.entries = Entry.query(function(results){
    var startDay = moment().startOf('day').toDate()
    $scope.canMakeNew = true
    for (var i = 0; i < results.length; ++i) {
      if (new Date(results[i].timestamp) > startDay) {
        $scope.canMakeNew = false
        break
      }
    }
  })

  $scope.newEntry = function() {
    var newEntry = new Entry()
    newEntry.$save(function(entry, header) {
      $location.url('/entry/'+entry._id)
    })
  }
})

app.controller('EntryController', function($scope, Entry, $rootScope, $routeParams) {
  Entry.get({_id:$routeParams._id}, function(u, getResponseHeaders){
    $scope.entry = u       
  });

  $scope.save = function() {
    $scope.entry.$update()
  }
})

app.controller('MeController', function(Me, $scope, $rootScope) {
  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.save = function() {
    $rootScope.me.$update()
  }
})