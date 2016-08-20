angular.module('starter.controllers').controller('ChatsTabLocalCtrl', function($scope, $state, $rootScope) {
  $scope.onTabSelected = function() {
    if($rootScope.chatPage == "tab.chat")
      $state.go('tab.chats');
    else{
      $state.go($rootScope.chatPage, {"chatId" : $rootScope.chatParam})
    }
  }
});