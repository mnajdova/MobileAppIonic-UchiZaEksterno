controllers.controller('ChatDetailCtrl', function($scope, $timeout, $ionicScrollDelegate, $location, $localstorage, $firebase, $state, $rootScope, fireBaseData, $ionicPlatform) {

    $scope.myId = $localstorage.getObject('user').$id;

    console.log($location.path());
    var array = $location.path().split("/");
    var questionId = array[array.length - 1];
    console.log(array[array.length - 1]);

    var questionRef = fireBaseData.appRef().child("questions").child(parseInt(questionId));
    var ref = questionRef.child("chatroom").child("messages");
    ref.on("value", function(list){
        $timeout(function() {
            $ionicScrollDelegate.resize();
            $ionicScrollDelegate.scrollBottom(true);
        }, 100);
    });
    $scope.messages = $firebase(ref).$asArray();
    console.log($scope.messages);
    $timeout(function() {
        $ionicScrollDelegate.resize();
        $ionicScrollDelegate.scrollBottom(true);
    }, 300);

    $scope.myId = $localstorage.getObject('user').$id;

    $scope.hideTime = true;

    var alternate,
        isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

    $scope.sendMessage = function() {

        var d = new Date();
        d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
        $scope.messages.$add({
            user_id: $scope.myId,
            text: $scope.data.message,
            time: d,
            user_picture: $localstorage.getObject('user')["picture_url"]
        });

        delete $scope.data.message;

        if (isIOS) $scope.data.keyboardHeight = 0;

        $timeout(function() {
            $ionicScrollDelegate.resize();
            $ionicScrollDelegate.scrollBottom(true);
        }, 300);
    };


    $scope.inputUp = function() {
        if (isIOS) $scope.data.keyboardHeight = 216;
        $timeout(function() {
            $ionicScrollDelegate.scrollBottom(true);
        }, 300);

    };

    $scope.inputDown = function() {
        if (isIOS) $scope.data.keyboardHeight = 0;
        $ionicScrollDelegate.resize();
    };

    $scope.closeKeyboard = function() {
        cordova.plugins.Keyboard.close();
    };

    $scope.myGoBack = function(){
        $state.go("tab.chats");
    }

    $scope.data = {};

});
