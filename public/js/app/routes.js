easy.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/home");
  //
  // Now set up the states
  $stateProvider
    .state('home', {
      url: "/home",
      templateUrl: "/partials/home"
    })
    .state('book', {
      url: "/book/:bookName",
      templateUrl: "/partials/book",
      controller:'bookCtrl'
    })
    .state('library', {
      url: "/library",
      templateUrl: "/partials/library",
      controller:'libraryCtrl'
    })
     .state('profile', {
      url: "/profile/:name",
      templateUrl: "/partials/profile",
      controller:'profileCtrl'
    })

   /* .state('state1.list', {
      url: "/list",
      templateUrl: "partials/state1.list.html",
      controller: function($scope) {
        $scope.items = ["A", "List", "Of", "Items"];
      }
    })
    .state('state2', {
      url: "/state2",
      templateUrl: "partials/state2.html"
    })
    .state('state2.list', {
      url: "/list",
      templateUrl: "partials/state2.list.html",
      controller: function($scope) {
        $scope.things = ["A", "Set", "Of", "Things"];
      }
    }) */ ;
});