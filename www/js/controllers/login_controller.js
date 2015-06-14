controllers.controller('LoginCtrl', function($scope, fireBaseData, $firebase, $localstorage, $rootScope, $state, $ionicLoading) {


    if(JSON.stringify($localstorage.getObject('user'))!="{}"){
        $state.transitionTo("tab.account", {}, {
            reload: true,
            inherit: false,
            notify: true
        });
    }

    $scope.data = {
        email: "",
        password: ""
    };

    $scope.errormessage="";

    $scope.login = function(email, password) {
        if (typeof email == 'undefined' || email == "") {
            $scope.errormessage = "Внесете го вашиот меил.";
        } else if (typeof password == 'undefined' || password == "") {
            $scope.errormessage = "Внесете лозинка.";
        }
        else {
            var ref = new Firebase("https://uchizaeksterno.firebaseio.com");
            $scope.gettingData = true;
            ref.authWithPassword({
                email: email,
                password: password
            }, function (error, authData) {
                if (error) {
                    $scope.gettingData = false;
                    switch (error.code) {
                        case "INVALID_EMAIL":
                            console.log("The specified user account email is invalid.");
                            $scope.$apply(function () {
                                $scope.errormessage = "E-маил адресата е невалидна.";
                            });
                            break;
                        case "INVALID_PASSWORD":
                            console.log("The specified user account password is incorrect.");
                            $scope.$apply(function () {
                                $scope.errormessage = "Специфицираната лозинка е невалидна.";
                            });
                            break;
                        case "INVALID_USER":
                            console.log("The specified user account does not exist.");
                            $scope.$apply(function () {
                                $scope.errormessage = "Оваа корисничка сметка не постои.";
                            });
                            break;
                        default:
                            $scope.$apply(function () {
                                $scope.errormessage = "Настана грешка, ве молиме проверете ги вашите податоци";
                            });
                    }
                }
                else {
                    console.log("Authenticated successfully with payload:", authData);

                    var users = fireBaseData.usersRef();
                    var usersArray = $firebase(users).$asArray();

                    usersArray.$loaded(function (list) {
                        var user = list.$getRecord(authData.auth.uid);

                        $localstorage.setObject('user', {
                            $id: user["$id"],
                            first_name: user["first_name"],
                            last_name: user["last_name"],
                            picture_url: user["picture_url"]
                        });
                        $scope.gettingData = false;

                        $scope.data = {
                            email: "",
                            password: ""
                        };


                        if ($rootScope.invoker == 'chats') {
                            $state.transitionTo("tab.account", {}, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                            $rootScope.shouldGoTo = "chat";
                        }
                        else if (JSON.stringify($rootScope.question) != "{}") {
                            addChatroomIfNeeded();
                        } else {
                            $state.transitionTo("tab.account", {}, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                            $rootScope.shouldGoTo = "account";
                        }


                    })
                }
            })
        }
    }

    function addChatroomIfNeeded(){
        console.log($rootScope.question);
        if(JSON.stringify($rootScope.question) != "{}" ){
            var question = $rootScope.question;
            $rootScope.question = {};
            console.log(question);
            var users = fireBaseData.usersRef();
            var usersArray = $firebase(users).$asArray();

            usersArray.$loaded(function (list) {
                var user = list.$getRecord($localstorage.getObject('user').$id);
                console.log(parseInt(question.id));
                console.log(typeof user["chatrooms"]);
                if (typeof user["chatrooms"] === 'undefined') {
                    console.log("The user doesn't exist or had a empty chatrooms");

                    users.child($localstorage.getObject('user').$id).set({
                        first_name: $localstorage.getObject('user').first_name,
                        last_name: $localstorage.getObject('user').last_name,
                        picture_url: $localstorage.getObject('user').picture_url,
                        chatrooms: [parseInt(question.id)]
                    }, function(){
                        $state.transitionTo("tab.account", {}, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                        $rootScope.shouldGoTo = "chat";
                    });
                }
                else {
                    var chatrooms = $firebase(users.child($localstorage.getObject('user').$id).child("chatrooms")).$asArray();
                    chatrooms.$loaded(function (listChatrooms) {
                        console.log(listChatrooms.length);
                        if (listChatrooms.length > 0) {
                            var contains = false;
                            for (var i = 0; i < listChatrooms.length; i++) {
                                console.log($scope.question.id);
                                console.log(listChatrooms[i]);
                                if (listChatrooms[i].$value == parseInt(question.id)) {
                                    contains = true;
                                    break;
                                }
                            }
                            if (contains == false) {
                                users.child($localstorage.getObject('user').$id).child("chatrooms").child(listChatrooms.length).set(parseInt(question.id));
                            }

                            $state.transitionTo("tab.account", {}, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                            $rootScope.shouldGoTo = "chat";
                        }
                    })
                }
            });
        }
    }
});