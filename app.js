(function() {
  "use strict";

  angular.module('tp1', [
    //'ui.router',
    'restangular'
  ])
  .directive("users", function() {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: "/templates/users.html",
      controllerAs: "vm",
      bindToController: true,
      controller: function(Restangular) {
        Restangular.allUrl("users", "http://localhost:3000/users")
        .getList()
        .then((res) => {
          console.log(arguments);
          this.users = res;
        });
      }
    };
  }).directive("user", function() {
    return {
      restrict: 'E',
      scope: {
        name: "=",
        id: "="
      },
      controllerAs: "vm",
      bindToController: true,
      templateUrl: "/templates/user.html",
      controller: function() {

      }
    };
  });
})();
