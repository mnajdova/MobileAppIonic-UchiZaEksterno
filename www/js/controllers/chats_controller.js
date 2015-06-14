controllers.controller('ChatsCtrl', function ($scope, fireBaseData, $firebase, $localstorage, $stateParams, $ionicLoading, $ionicPopup, $rootScope, $state) {

    $rootScope.chatPage = "tab.chat";

    $scope.removeQuestion = function(id){

        console.log(id);
        var questionIds = [];
        for(var i=0 ;i<$scope.questions.length;i++){
            console.log($scope.questions[i]);
            if(parseInt($scope.questions[i]['id'])!= parseInt(id)){
                questionIds.push(parseInt($scope.questions[i]['id']));
            }
        }
        console.log(questionIds);

        $scope.gettingData = true;
        var usersRef = fireBaseData.usersRef();
        var user = usersRef.child($localstorage.getObject('user').$id).child('chatrooms').set(questionIds, function(){
            $scope.gettingData = false;
            $state.transitionTo("tab.chats", {}, {
                reload: true,
                inherit: false,
                notify: true
            });
        });
    };

    $scope.data = Object();
    function getChatrooms() {
        $scope.data.gettingData = true;
        console.log("Korisnikot ne e prazen string");
        var usersRef = fireBaseData.usersRef();
        var user = usersRef.child($localstorage.getObject('user').$id);
        user.on("value", function (us) {
            var u = us.val();
            console.log("Korisnikot e izloudan");
            console.log(u);
            console.log(typeof u["chatrooms"]);

            if (typeof u["chatrooms"] != 'undefined') {
                console.log("Chatrooms ne e undefined");
                var chatroomsIds = u["chatrooms"];
                console.log("chatroomsIds: " + chatroomsIds);
                $scope.questions = Array();
                var done = 0;
                for (var i = 0; i < chatroomsIds.length; i++) {
                    var text = fireBaseData.questionsRef().child(chatroomsIds[i]).child("text");
                    text.on("value", function (t){
                        console.log(t.val());
                        console.log(t);
                        var id = t["Cc"]["path"]["u"][1];
                        console.log(id);
                        $scope.questions.push({"text": t.val(), "id": id});
                        done++;
                        if(done>=chatroomsIds.length) {
                            $scope.data.gettingData = false;
                            $rootScope.$$phase || $scope.$apply(function(){$scope.data.gettingData = false});
                            console.log($scope.data.gettingData);
                            console.log("Stop");
                        }
                    });
                }
            }
            else{
                $scope.data.gettingData = false;
                console.log($scope.data.gettingData);
                $rootScope.$$phase || $scope.$apply(function(){$scope.data.gettingData = false});
                console.log("Stop");
            }
        })
    }

    if (JSON.stringify($localstorage.getObject('user')) != "{}") {
        console.log("se povikuva getchatrooms");
        getChatrooms();
    }
    else {
        confirmPopup = $ionicPopup.confirm({
            title: 'Задолжителна најава',
            template: 'За да ги прегледувате вашите соби за разговор мора да сте најавен.',
            buttons:[
                {
                    text: 'Откажи'
                },
                {
                    text: 'OK',
                    type: 'button-calm',
                    onTap: function(){
                        return true;
                    }
                }
            ]
        });
        confirmPopup.then(function (res) {
            if (res == true) {
                $rootScope.question = {};
                $rootScope.invoker = "chats";
                $state.go("tab.account");
            }
        });
    }
});