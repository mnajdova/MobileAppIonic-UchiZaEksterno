angular.module('starter.controllers').controller('ChatsCtrl', function ($scope, fireBaseData, $timeout, $firebase, $localstorage, $stateParams, $ionicLoading, $ionicPopup, $rootScope, $state) {

    $rootScope.chatPage = "tab.chat";

    $scope.data = {
        gettingData: true,
        refreshShow: false
    };

    $scope.refresh = refresh;
    $scope.removeQuestion = removeQuestion;

    function refresh() {
        $scope.data.refreshShow = false;
        $scope.data.gettingData = true;
        getChatrooms();
    };

    function removeQuestion(id) {
        var questionIds = [];
        for (var i = 0; i < $scope.questions.length; i++) {
            if (parseInt($scope.questions[i]['id']) != parseInt(id)) {
                questionIds.push(parseInt($scope.questions[i]['id']));
            }
        }

        $scope.gettingData = true;
        var usersRef = fireBaseData.usersRef();
        var user = usersRef.child($localstorage.getObject('user').$id).child('chatrooms').set(questionIds, function () {
            $scope.gettingData = false;
            $state.transitionTo("tab.chats", {}, {
                reload: true,
                inherit: false,
                notify: true
            });
        });
    };

    function getChatrooms() {

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
                    $scope.data.gettingData = false;
                    $scope.data.refreshShow = true;
                });
            }
            else {
                $scope.data.gettingData = true;
                var usersRef = fireBaseData.usersRef();
                var user = usersRef.child($localstorage.getObject('user').$id);
                user.on("value", function (us) {
                    var u = us.val();

                    if (typeof u["chatrooms"] != 'undefined') {
                        var chatroomsIds = u["chatrooms"];
                        $scope.questions = Array();
                        var done = 0;
                        for (var i = 0; i < chatroomsIds.length; i++) {
                            var text = fireBaseData.questionsRef().child(chatroomsIds[i]).child("text");
                            text.on("value", function (t) {
                                var id = t["V"]["path"]["n"][1];
                                $scope.questions.push({"text": t.val(), "id": id});
                                done++;
                                if (done >= chatroomsIds.length) {

                                    $scope.data.gettingData = false;
                                    $rootScope.$$phase || $scope.$apply(function () {
                                        $scope.data.gettingData = false
                                    });
                                }
                            });
                        }
                    }
                    else {
                        $scope.data.gettingData = false;
                        $rootScope.$$phase || $scope.$apply(function () {
                            $scope.data.gettingData = false
                        });
                    }
                });

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
                $scope.data.gettingData = false;
                $scope.data.refreshShow = true;
            });
        }
    }

    if (JSON.stringify($localstorage.getObject('user')) != "{}") {
        getChatrooms();
    }
    else {
        confirmPopup = $ionicPopup.confirm({
            title: 'Задолжителна најава',
            template: 'За да ги прегледувате вашите соби за разговор мора да сте најавен.',
            buttons: [
                {
                    text: 'Откажи'
                },
                {
                    text: 'OK',
                    type: 'button-calm',
                    onTap: function () {
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