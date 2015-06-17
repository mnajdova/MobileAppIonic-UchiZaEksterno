controllers.controller('ChatDetailCtrl', function($scope, $timeout, $ionicScrollDelegate, $location, $ionicPopup, $localstorage, $firebaseArray, $state, $rootScope, fireBaseData, $ionicPlatform, $ionicModal, $cordovaCamera) {

    $scope.myId = $localstorage.getObject('user').$id;

    $scope.gettingData = true;

    var array = $location.path().split("/");
    var questionId = array[array.length - 1];

    $rootScope.chatPage = "tab.chat-detail";
    $rootScope.chatParam = questionId;

    $timeout(function() {
        $ionicScrollDelegate.resize();
        $ionicScrollDelegate.scrollBottom(true);
    }, 400);

    $scope.hideTime = true;

    var alternate,
        isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

    $scope.refreshShow = false;

    //For mobile
    $timeout(function () {
        $scope.getData();
    }, 1000);


    $scope.getData = function () {
        if (window.Connection) {
            if (navigator.connection.type == Connection.NONE) {
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
            else {

                var questionRef = fireBaseData.appRef().child("questions").child(parseInt(questionId));
                var ref = questionRef.child("chatroom").child("messages");

                ref.on("value", function(list){
                    $timeout(function() {
                        $ionicScrollDelegate.resize();
                        $ionicScrollDelegate.scrollBottom(true);
                    }, 100);
                });

                $scope.messages = $firebaseArray(ref);

                $scope.messages.$loaded(function(list){
                    $timeout(function() {
                        $scope.gettingData = false;
                        $scope.refreshShow = false;
                        $ionicScrollDelegate.resize();
                        $ionicScrollDelegate.scrollBottom(true);
                    });
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
                $scope.gettingData = false;
                $scope.refreshShow = true;
            });
        }
    };

    $scope.refresh = function () {
        $scope.refreshShow = false;
        $scope.gettingData = true;
        $scope.getData();
    };

    //For computer
    //var questionRef = fireBaseData.appRef().child("questions").child(parseInt(questionId));
    //var ref = questionRef.child("chatroom").child("messages");
    //
    //ref.on("value", function(list){
    //    $timeout(function() {
    //        $ionicScrollDelegate.resize();
    //        $ionicScrollDelegate.scrollBottom(true);
    //    }, 100);
    //});
    //
    //$scope.messages = $firebaseArray(ref);
    //
    //$scope.messages.$loaded(function(list){
    //    $timeout(function() {
    //        $scope.gettingData = false;
    //        $ionicScrollDelegate.resize();
    //        $ionicScrollDelegate.scrollBottom(true);
    //    });
    //});




    $scope.inputUp = function() {
        if (isIOS) $scope.data.keyboardHeight = 216;
        $timeout(function() {
            $ionicScrollDelegate.scrollBottom(true);
        }, 500);

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
    };

    $scope.showPopup = function(){
        $scope.myPopup = $ionicPopup.show({
            template: '<button class="button button-full button-calm" ng-click="upload(0)">Камера</button><button class="button button-full button-calm" ng-click="upload(1)">Галерија</button>',
            title: 'Прикачи фотографија',
            subTitle: 'Изберете една од опциите',
            scope: $scope,
            buttons: [
                { text: 'Cancel' }
            ]
        });
    };

    $scope.upload = function(type) {
        $scope.myPopup.close();
        var sourceType;
        if(type == 0)
            sourceType = Camera.PictureSourceType.CAMERA;
        else
            sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
        var options = {
            quality : 100,
            destinationType : Camera.DestinationType.DATA_URL,
            sourceType : sourceType,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            targetWidth: 500,
            targetHeight: 500,
            saveToPhotoAlbum: false
        };
        $cordovaCamera.getPicture(options).then(function(imageData) {

            var d = new Date();
            d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
            if((typeof $scope.data) === 'undefined' || (typeof $scope.data.message) === 'undefined' || $scope.data.message == ""){
                $scope.messages.$add({
                    user_id: $scope.myId,
                    image: imageData,
                    time: d,
                    user_picture: $localstorage.getObject('user')["picture_url"]
                });
            }
            else{
                $scope.messages.$add({
                    user_id: $scope.myId,
                    text: $scope.data.message,
                    image: imageData,
                    time: d,
                    user_picture: $localstorage.getObject('user')["picture_url"]
                });
            }

            delete $scope.data.message;

            if (isIOS) $scope.data.keyboardHeight = 0;

            $timeout(function() {
                $ionicScrollDelegate.resize();
                $ionicScrollDelegate.scrollBottom(true);
            }, 300);

        }, function(error) {
            var alertPopup = $ionicPopup.alert({
                title: 'Настана грешка',
                template: 'Сликата не беше успешно зачувана. Ве молиме обидете се повторно',
                buttons: [
                    {text: 'OK',
                        type: 'button-calm'
                    }
                ]
            });
            console.error(error);
        });
    };

    $scope.showImage = function(image) {
        $scope.image = image;
        $scope.showModal('templates/image-popover.html');
    };

    $scope.showModal = function(templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    }

    $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal.remove()
    };

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

        if(isIOS)
            $scope.data.keyboardHeight = 0;

        $timeout(function() {
            $ionicScrollDelegate.resize();
            $ionicScrollDelegate.scrollBottom(true);
        }, 1000);
    };


    $scope.data = {};











});
