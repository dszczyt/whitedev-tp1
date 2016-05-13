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
        template: "<ui-view/>",
        controller: function($state) {
          if($state.is('users'))
            $state.go('.list');
        }
      }
    )
    .state(
      "users.list",
      {
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
      "users.new",
      {
        url: "/new",
        templateUrl: "/templates/user-form.html",
        controller: function(Restangular, $state) {
          this.newUser = function(userName) {
            Restangular.all("users").post({
              name: userName
            }).then(function() {
              $state.go('^.list');
            });
          };
        },
        controllerAs: 'vm'
      }
    )
    .state(
      "users.details",
      {
        url: "/:id",
        template: "<div user=\"vm.user\" mode=\"details\"></div>",
        resolve: {
          user: function(Restangular, $stateParams) {
            return Restangular.one("users", $stateParams.id).get();
          }
        },
        controller: function(user) {
          this.user = user;
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
        this.userElements = [];

        this.test = function() {
          this.userElements.forEach(function(user) {
            console.log(user);
          });
        };
      }
    };
  }).directive("user", function() {
    return {
      restrict: 'EA',
      scope: {
        user: "=",
        mode: "@"
      },
      require: '?^users',
      controllerAs: "vm",
      bindToController: true,
      //replace: true,
      templateUrl: function(element, attrs) {
        console.log(attrs);
        switch(attrs.mode) {
          case "details":
          return "/templates/user-details.html";
          default:
          return "/templates/user.html";
        }
      },
      controller: function() {
        this.fn = function() {
          console.log(this.user);
        };
      },
      link: function(scope, element, attrs, usersCtrl) {
        if (usersCtrl !== null) usersCtrl.userElements.push(scope);
      }
    };
  });
})();
