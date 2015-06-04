controllers.controller('ChatsCtrl', function($scope, fireBaseData, $firebase, $localstorage, $stateParams, $ionicLoading, $ionicPopup, $rootScope, $state) {

    function showLoading(){
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner><style>.loading{background-color: inherit !important; } </style>'
        });
    }

    function hideLoading(){
        $ionicLoading.hide();
    }

    function getChatrooms(){
        showLoading();
        console.log("Korisnikot ne e prazen string");
        var usersRef = fireBaseData.usersRef();
        var user = usersRef.child($localstorage.getObject('user').$id);
        user.on("value", function (us) {
            var u = us.val();
            console.log("Korisnikot e izloudan");
            console.log(u);
            console.log(typeof u["chatrooms"]);
            if(typeof u["chatrooms"] != 'undefined'){
                console.log("Chatrooms ne e undefined");
                var chatroomsIds = u["chatrooms"];
                console.log("chatroomsIds: "+chatroomsIds);
                $scope.questions = Array();
                var questions = fireBaseData.questionsRef();
                questions.$loaded(function(list){
                    for(var i=0; i<chatroomsIds.length;i++){
                        $scope.questions.push(list[chatroomsIds[i]]);
                    }
                    hideLoading();
                })
            }
            else
                hideLoading();
        })
    }

    if(JSON.stringify($localstorage.getObject('user')) != "{}") {
        console.log("se povikuva getchatrooms");
        getChatrooms();
    }
    else{
        confirmPopup = $ionicPopup.confirm({
            title: 'Задолжителна најава',
            template: 'За да ги прегледувате вашите соби за разговор мора да сте најавен.'
        });
        confirmPopup.then(function(res) {
            if(res==true) {
                $rootScope.question = {};
                $rootScope.invoker = "chats";
                $state.go("tab.account");
            }
        });
    }
});