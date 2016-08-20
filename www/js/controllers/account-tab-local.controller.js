angular.module('starter.controllers').controller('AccountTabLocalCtrl', function($scope, $state, $rootScope) {
  $scope.onTabSelected = function() {
    $rootScope.invoker = "account";
    $state.go('tab.account');
  }
});