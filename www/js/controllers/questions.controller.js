angular.module('starter.controllers').controller('QuestionsCtrl', function($scope, fireBaseData, $firebaseArray, $localstorage, $ionicPopup, $state, $ionicLoading, $ionicSlideBoxDelegate, $ionicHistory, $location, $rootScope, $timeout) {
    var array = $location.path().split("/");
    $scope.choise = array[array.length - 1];

    $scope.data = {
        gettingData: true
    };

    $scope.slideHasChanged = function slideHasChanged(index){$scope.index = index;};
    $scope.nextQuestion = function () {$ionicSlideBoxDelegate.next();};
    $scope.prevQuestion = function () {$ionicSlideBoxDelegate.previous();};
    $scope.joinChatRoom = joinChatRoom;

    var listQuestionsIds = [];

    var subjects = fireBaseData.subjectsRef();

    subjects.$loaded(function (list) {
        listQuestionsIds = list[$scope.choise]["questions"];
        $scope.questions = [];

        var done = 0;
        var k=0;
        var questions = [];
        for (var i = 0; i < listQuestionsIds.length; i++){
            questions[listQuestionsIds[i]] = Object();
            questions[listQuestionsIds[i]]["id"] = listQuestionsIds[i];

            var text = fireBaseData.questionsRef().child(listQuestionsIds[i]).child("text");
            text.on("value", function(v){
                var index = v["V"]["path"]["n"][1];
                done++;

                questions[parseInt(index)]["text"] = v.val();
                if(done>=listQuestionsIds.length*2){

                    var keys = [];
                    for (var key in questions) {
                        if (questions.hasOwnProperty(key)) {
                            keys.push(key);
                        }
                    }

                    for(var i=0; i<keys.length;i++){
                        $scope.questions[i] = questions[keys[i]];
                    }

                    $scope.index = 0;
                    $scope.question = $scope.questions[$scope.index];
                    $timeout(function(){
                        $ionicSlideBoxDelegate.update();
                    }, 100);
                    $scope.data.gettingData = false;
                }
            });
            var picture = fireBaseData.questionsRef().child(listQuestionsIds[i]).child("picture-url");
            picture.on("value", function(v){
                var index = v["V"]["path"]["n"][1];
                done++;

                questions[parseInt(index)]["picture-url"] = v.val();
                if(done>=listQuestionsIds.length*2){

                    var keys = [];
                    for (var key in questions) {
                        if (questions.hasOwnProperty(key)) {
                            keys.push(key);
                        }
                    }

                    for(var i=0; i<keys.length;i++){
                        $scope.questions[i] = questions[keys[i]];
                    }

                    $scope.index = 0;
                    $scope.question = $scope.questions[$scope.index];
                    $timeout(function(){
                        $ionicSlideBoxDelegate.update();
                    }, 100);
                    $scope.data.gettingData = false;
                }
            });

        }

    });

    function joinChatRoom() {

        if (JSON.stringify($localstorage.getObject('user')) != "{}") {
            var users = fireBaseData.usersRef();
            var usersArray = $firebaseArray(users);

            usersArray.$loaded(function (list) {
                var user = list.$getRecord($localstorage.getObject('user').$id);
                if (user == null || typeof user["chatrooms"] === 'undefined') {

                    users.child($localstorage.getObject('user').$id).set({
                            first_name: $localstorage.getObject('user').first_name,
                            last_name: $localstorage.getObject('user').last_name,
                            picture_url: $localstorage.getObject('user').picture_url,
                            chatrooms: [parseInt($scope.questions[$scope.index].id)]
                        }, function(err){
                            console.log(err);
                            $state.transitionTo("tab.chats", {}, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        }
                    );
                }
                else {
                    var chatrooms = $firebaseArray(users.child($localstorage.getObject('user').$id).child("chatrooms"));
                    chatrooms.$loaded(function (listChatrooms) {
                        if (listChatrooms.length > 0) {
                            var contains = false;
                            for (var i = 0; i < listChatrooms.length; i++) {
                                if (listChatrooms[i].$value == parseInt($scope.questions[$scope.index].id)) {
                                    contains = true;
                                    break;
                                }
                            }
                            if (contains == false) {
                                users.child($localstorage.getObject('user').$id).child("chatrooms").child(listChatrooms.length).set(parseInt($scope.questions[$scope.index].id));
                            }

                            $state.transitionTo("tab.chats", {}, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        }
                        else {
                            users.child($localstorage.getObject('user').$id).set({
                                first_name: $localstorage.getObject('user').first_name,
                                last_name: $localstorage.getObject('user').last_name,
                                picture_url: $localstorage.getObject('user').picture_url,
                                chatrooms: [parseInt($scope.questions[$scope.index].id)]
                            }, function(err){$state.transitionTo("tab.chats", {}, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });});
                        }
                    })
                }


            });

            $state.transitionTo("tab.chats", {}, {
                reload: true,
                inherit: false,
                notify: true
            });
        }
        else {
            confirmPopup = $ionicPopup.confirm({
                title: 'Задолжителна најава',
                template: 'За да се приклучите на собата за разговор за ова прашање мора да се најавите!',
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
            confirmPopup.then(function(res) {
                if(res==true) {
                    $rootScope.question = $scope.questions[$scope.index];
                    $rootScope.invoker = "questions";
                    $state.go("tab.account");
                }
            });
        }
    };
});
