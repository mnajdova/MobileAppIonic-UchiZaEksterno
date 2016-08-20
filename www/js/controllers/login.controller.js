angular.module('starter.controllers').controller('LoginCtrl', function ($scope, $ionicPopup, $timeout, fireBaseData, $firebaseArray, $localstorage, $rootScope, $state, $ionicLoading) {

    if (JSON.stringify($localstorage.getObject('user')) != "{}") {
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
    $scope.errormessage = "";

    $scope.login = login;
    $scope.callLogin = callLogin;

    function login(email, pass){
        if (window.Connection) {
            if (navigator.connection.type == Connection.NONE) {
                $ionicPopup.confirm({
                    title: "Интернет конекција",
                    content: "Вашата интернет конекција неможе да биде воспоставена. Конектирајте се на интернет и обидете се повторно.",
                    buttons: [
                        {text: 'Откажи'},
                        {
                            text: 'OK',
                            type: 'button-calm'
                        }
                    ]
                }).then(function (result) {
                    $scope.gettingData = false;
                    $scope.refreshShow = true;
                });
            }
            else {
                $scope.callLogin(email, pass);
            }
        } else {
            $ionicPopup.confirm({
                title: "Интернет конекција",
                content: "Дисконектирани сте од интернет. Ве молиме конектирајте се за да ги превземете податоците.",
                buttons: [
                    {text: 'Откажи'},
                    {
                        text: 'OK',
                        type: 'button-calm'
                    }
                ]
            }).then(function (result) {
                $scope.gettingData = false;
                $scope.refreshShow = true;
            });
        }
    }

    function callLogin(email, password) {
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

                            $scope.$apply(function () {
                                $scope.errormessage = "E-маил адресата е невалидна.";
                            });
                            break;
                        case "INVALID_PASSWORD":

                            $scope.$apply(function () {
                                $scope.errormessage = "Специфицираната лозинка е невалидна.";
                            });
                            break;
                        case "INVALID_USER":

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

                    var users = fireBaseData.usersRef();
                    var usersArray = $firebaseArray(users);

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
                            $rootScope.invoker = "account";
                            $rootScope.shouldGoTo = "chat";
                            $state.transitionTo("tab.account", {}, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        }
                        else if ($rootScope.invoker == 'questions') {
                            $rootScope.invoker = "account";
                            addChatroom();
                        } else {
                            $rootScope.shouldGoTo = "account";
                            $rootScope.invoker = "account";
                            $state.transitionTo("tab.account", {}, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        }


                    })
                }
            })
        }
    }

    function addChatroom() {

        var question = $rootScope.question;
        $rootScope.question = {};

        var users = fireBaseData.usersRef();
        var usersArray = $firebaseArray(users);

        usersArray.$loaded(function (list) {
            var user = list.$getRecord($localstorage.getObject('user').$id);

            if (typeof user["chatrooms"] === 'undefined') {

                users.child($localstorage.getObject('user').$id).set({
                    first_name: $localstorage.getObject('user').first_name,
                    last_name: $localstorage.getObject('user').last_name,
                    picture_url: $localstorage.getObject('user').picture_url,
                    chatrooms: [parseInt(question.id)]
                }, function () {
                    $rootScope.shouldGoTo = "chat";
                    $rootScope.invoker = "account";
                    $state.transitionTo("tab.account", {}, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                });
            }
            else {
                var chatrooms = $firebaseArray(users.child($localstorage.getObject('user').$id).child("chatrooms"));
                chatrooms.$loaded(function (listChatrooms) {

                    if (listChatrooms.length > 0) {
                        var contains = false;
                        for (var i = 0; i < listChatrooms.length; i++) {

                            if (listChatrooms[i].$value == parseInt(question.id)) {
                                contains = true;
                                break;
                            }
                        }
                        if (contains == false) {
                            users.child($localstorage.getObject('user').$id).child("chatrooms").child(listChatrooms.length).set(parseInt(question.id));
                        }

                        $rootScope.shouldGoTo = "chat";
                        $rootScope.invoker = "account";
                        $state.transitionTo("tab.account", {}, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });

                    }
                })
            }
        });

    }
});