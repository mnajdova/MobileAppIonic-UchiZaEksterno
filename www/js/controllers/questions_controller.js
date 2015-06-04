controllers.controller('QuestionsCtrl', function($scope, fireBaseData, $firebase, $localstorage, $ionicPopup, $state, $ionicLoading, $ionicSlideBoxDelegate, $ionicHistory, $location, $rootScope, $timeout) {
    var array = $location.path().split("/");
    $scope.choise = array[array.length - 1];
    console.log(array[array.length - 1]);

    $scope.gettingData = true;

    var listQuestionsIds = [];

    var subjects = fireBaseData.subjectsRef();

    subjects.$loaded(function (list) {
        listQuestionsIds = list[$scope.choise]["questions"];
        console.log(list[$scope.choise]);
        console.log(list);
        $scope.questions = Array();
        var questions = fireBaseData.questionsRef();
        questions.$loaded(function (list) {
            for (var i = 0; i < listQuestionsIds.length; i++) {
                $scope.questions.push(list[listQuestionsIds[i]]);
            }
            $scope.index = 0;
            $scope.question = $scope.questions[$scope.index];
            console.log($scope.questions);
            $timeout(function(){
                $ionicSlideBoxDelegate.update();
            }, 500);

            $scope.gettingData = false;
            console.log($scope.question);

        })
    })

    $scope.slideHasChanged = function(index){
        $scope.index = index;
        console.log("se povika");
    };

    $scope.nextQuestion = function () {
        $ionicSlideBoxDelegate.next();
    };

    $scope.prevQuestion = function () {
        $ionicSlideBoxDelegate.prev();
    };

    $scope.joinChatRoom = function () {

        if (JSON.stringify($localstorage.getObject('user')) != "{}") {
            console.log("Userot e veke logiran");
            var users = fireBaseData.usersRef();
            var usersArray = $firebase(users).$asArray();

            usersArray.$loaded(function (list) {
                var user = list.$getRecord($localstorage.getObject('user').$id);
                if (user == null || typeof user["chatrooms"] === 'undefined') {
                    console.log("The user doesn't exist or had a empty chatrooms");

                    users.child($localstorage.getObject('user').$id).set({
                            first_name: $localstorage.getObject('user').first_name,
                            last_name: $localstorage.getObject('user').last_name,
                            picture_url: $localstorage.getObject('user').picture_url,
                            chatrooms: [parseInt($scope.questions[$scope.index].$id)]
                        }, function(err){
                            console.log(err);
                            //$state.transitionTo("tab.chats", $state.$current.params, {reload: true});
                            $state.transitionTo("tab.chats", {}, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        }
                    );
                }
                else {
                    console.log("The user existed");
                    var chatrooms = $firebase(users.child($localstorage.getObject('user').$id).child("chatrooms")).$asArray();
                    chatrooms.$loaded(function (listChatrooms) {
                        console.log("Vo listChatrooms");
                        console.log(listChatrooms.length);
                        if (listChatrooms.length > 0) {
                            var contains = false;
                            for (var i = 0; i < listChatrooms.length; i++) {
                                console.log($scope.questions[$scope.index].$id);
                                console.log(listChatrooms[i].$value);
                                if (listChatrooms[i].$value == parseInt($scope.questions[$scope.index].$id)) {
                                    contains = true;
                                    console.log("Go najde");
                                    break;
                                }
                            }
                            if (contains == false) {
                                console.log("ne postoese");
                                users.child($localstorage.getObject('user').$id).child("chatrooms").child(listChatrooms.length).set(parseInt($scope.questions[$scope.index].$id));
                            }

                            $state.transitionTo("tab.chats", {}, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });;
                        }
                        else {
                            users.child($localstorage.getObject('user').$id).set({
                                first_name: $localstorage.getObject('user').first_name,
                                last_name: $localstorage.getObject('user').last_name,
                                picture_url: $localstorage.getObject('user').picture_url,
                                chatrooms: [parseInt($scope.questions[$scope.index].$id)]
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
                template: 'За да се приклучите на собата за разговор за ова прашање мора да се најавите!'
            });
            confirmPopup.then(function(res) {
                if(res==true) {
                    $state.go("tab.account");
                    $rootScope.question = $scope.questions[$scope.index];
                    console.log($rootScope.question);
                }
            });
        }
    };
});