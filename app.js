(function() {
  "use strict";

  angular.module('tp1', [
    'ui.router',
    'restangular'
  ])
  .config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl("http://localhost:3000");
  })
  .config(function($stateProvider) {
    $stateProvider
    .state(
      "users",
      {
        url: "/users",
        template: "" +
          "<users users=\"vm.users\"></users>" +
          "<a href=\"javascript:void(0);\" ui-sref=\".bidon\">lien vers l'état bidon</a>" +
          "<ui-view/>",
        resolve: {
          users: function(Restangular) {
            return Restangular.all("users").getList();
          }
        },
        controller: function(users) {
          this.users = users;
        },
        controllerAs: 'vm'
      }
    )
    .state(
      "users.bidon",
      {
        template: "<b>Ceci est l'état bidon</b> <a href=\"javascript:void(0);\" ui-sref=\"^\">retour à l'état parent</a>"
      }
    );
  })
  .directive("users", function() {
    return {
      restrict: 'E',
      scope: {
        users: "="
      },
      templateUrl: "/templates/users.html",
      controllerAs: "vm",
      bindToController: true,
      controller: function(Restangular, $state) {
        this.saveNewUser = function(userName) {
          Restangular.all("users").post({
            name: userName
          }).then(function() {
            $state.reload();
          });
        };
      }
    };
  }).directive("user", function() {
    return {
      restrict: 'EA',
      scope: {
        user: "=",
      },
      controllerAs: "vm",
      bindToController: true,
      //replace: true,
      templateUrl: "/templates/user.html",
      controller: function() {

      }
    };
  });
})();
