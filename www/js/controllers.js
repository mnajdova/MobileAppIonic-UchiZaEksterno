var controllers = angular.module('starter.controllers', ['ionic.utils']);
controllers.controller('ChatsTabLocalCtrl', function($scope, $state, $rootScope) {
        $scope.onTabSelected = function() {
            console.log("Invoked");
            if($rootScope.chatPage == "tab.chat")
                $state.go('tab.chats');
            else{
                $state.go($rootScope.chatPage, {"chatId" : $rootScope.chatParam})
            }
        }
});

controllers.controller('AccountTabLocalCtrl', function($scope, $state, $rootScope) {
    $scope.onTabSelected = function() {
        $rootScope.invoker = "account";
        $state.go('tab.account');
    }
});
