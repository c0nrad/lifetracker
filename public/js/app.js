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

app.controller('HeaderController', function($scope, $location) 
{ 
  $scope.isActive = function (viewLocation) { 
      return viewLocation === $location.path();
  };
})

app.controller('MainController', function($scope) {
  $scope.title = "Home";
})

app.factory('Entry', function($resource) {
  return $resource( '/api/entries/:_id?sort=-timestamp', {_id: "@_id"}, {'update': { method:'PUT' } });
})


app.factory('Me', function($resource, $rootScope) {
  var Me = $resource('/me', {}, {
    'get':    {
      responseType: 'json',
      method:'GET',
      transformResponse: function(data, header) {
        data.emailTime = moment(data.emailTime, "HH:mm").toDate()
        data.smsTime = moment(data.smsTime, "HH:mm").toDate()

        return data
      }
    },
    'update': { 
      responseType: 'json',
      method:'PUT',
      transformRequest: function(data, header) {
        data = jQuery.extend({}, data)
        data.emailTime = moment(data.emailTime).format("HH:mm")
        data.smsTime = moment(data.smsTime).format("HH:mm")

        return JSON.stringify(data);
      },
      transformResponse: function(data, header) {
        data.emailTime = moment(data.emailTime, "HH:mm").toDate()
        data.smsTime = moment(data.smsTime, "HH:mm").toDate()
        return data
      }
    }
  })

  Me.get({}, function(me, headers) {
    $rootScope.me = me
  });
  return Me
})

app.controller('EntriesController', function($scope, Entry, $rootScope, $location) {

  $scope.canMakeNew = false

  $rootScope.entries = Entry.query(function(results){
    var startDay = moment().startOf('day').toDate()
    $scope.canMakeNew = true
    for (var i = 0; i < results.length; ++i) {
      if (new Date(results[i].timestamp) >= startDay) {
        $scope.canMakeNew = false
        break
      }
    }
  }, function(error) {
    console.log("entry error", error)
    if (error.status == 404) {
      $scope.canMakeNew = true
    }
  })

  $scope.newEntry = function() {
    var newEntry = new Entry({user: $rootScope.me._id })
    newEntry.$save(function(entry, header) {
      $location.url('/entry/'+entry._id)
    })
  }
})

app.controller('EntryController', function($scope, Entry, $rootScope, $routeParams) {
  Entry.get({_id:$routeParams._id}, function(u, getResponseHeaders){
    $scope.entry = u  
    $scope.updateProgress()     
  });

  $scope.progress = 0

  $scope.updateProgress = function() {
    $scope.progress = (+ ($scope.entry.grateful1.length != 0)) +
                      (+ ($scope.entry.grateful2.length != 0)) +
                      (+ ($scope.entry.grateful3.length != 0)) +
                      (+ ($scope.entry.journal.length != 0)) +
                      (+$scope.entry.isExercise) + 
                      (+$scope.entry.isMeditate) +
                      (+$scope.entry.isRAK);
  }
  
  $scope.save = function() {
    $scope.entry.$update()
    $scope.updateProgress()
  }
})

app.controller('MeController', function(Me, $scope, $rootScope) {
  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.save = function() {
    $rootScope.me.$update()
  }
})