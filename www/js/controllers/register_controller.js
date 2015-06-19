controllers.controller('RegisterCtrl', function ($scope, fireBaseData, $ionicPopup, $timeout, $firebaseArray, $localstorage, $rootScope, $state, $ionicLoading) {
    console.log("In register ctrl");

    if (JSON.stringify($localstorage.getObject('user')) != "{}") {
        $state.transitionTo("tab.account", {}, {
            reload: true,
            inherit: false,
            notify: true
        });
    }

    $scope.data = {
        fn: "",
        ln: "",
        em: "",
        pwd: ""
    };

    $scope.errormessage = "";


    $scope.registerUser = function (fn, ln, em, pwd){
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
                $scope.register(fn,  ln, em ,pwd);
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


    $scope.register = function (fn, ln, em, pwd) {
        console.log(fn);
        if (typeof fn == 'undefined' || fn == "") {
            $scope.errormessage = "Внесете го вашето име.";

        } else if (typeof ln == 'undefined' || ln == "") {
            $scope.errormessage = "Внесете го вашето презиме.";

        } else if (typeof em == 'undefined' || em == "") {
            $scope.errormessage = "Внесете го вашиот меил.";

        } else if (typeof pwd == 'undefined' || pwd == "") {
            $scope.errormessage = "Внесете лозинка.";

        }
        else {
            var ref = new Firebase("https://uchizaeksterno.firebaseio.com");
            $scope.gettingData = true;
            ref.createUser({
                email: em,
                password: pwd
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
                } else {
                    ref.authWithPassword({
                        email: em,
                        password: pwd
                    }, function (error, authData) {
                        if (error) {
                            console.log("Login Failed!", error);
                        } else {
                            console.log("Authenticated successfully with payload:", authData);

                            $localstorage.setObject('user', {
                                $id: authData.auth.uid,
                                first_name: fn,
                                last_name: ln,
                                picture_url: $rootScope.noUserPictreUrl
                            });

                            var users = fireBaseData.usersRef();
                            users.child(authData.auth.uid).set({
                                    first_name: fn,
                                    last_name: ln,
                                    picture_url: $rootScope.noUserPictreUrl
                                }, function () {
                                    console.log("Se stavaat da se prazni");
                                    $scope.$apply(function () {
                                        $scope.data = {
                                            fn: "",
                                            ln: "",
                                            em: "",
                                            pwd: ""
                                        };

                                    });
                                    $scope.gettingData = false;
                                    console.log("================Rootscope question=============" + JSON.stringify($rootScope.question));
                                    console.log(JSON.stringify($rootScope.question));
                                    if ($rootScope.invoker == 'chats') {
                                        $rootScope.shouldGoTo = "chat";
                                        $rootScope.invoker = "account";
                                        $state.transitionTo("tab.account", {}, {
                                            reload: true,
                                            inherit: false,
                                            notify: true
                                        });
                                    }
                                    else if ($rootScope.invoker == "questions") {
                                        $rootScope.invoker = "account";
                                        addChatroom();
                                    } else {
                                        $rootScope.shouldGoTo = "account";
                                        $state.transitionTo("tab.account", {}, {
                                            reload: true,
                                            inherit: false,
                                            notify: true
                                        });
                                    }
                                }
                            );


                        }
                    })

                }
            });
        }
    }

    function addChatroom() {
        console.log($rootScope.question);
        var question = $rootScope.question;
        $rootScope.question = {};
        console.log(question);
        var users = fireBaseData.usersRef();
        var usersArray = $firebaseArray(users);

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
                }, function () {
                    $rootScope.shouldGoTo = "chat";
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

                        $rootScope.shouldGoTo = "chat";
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