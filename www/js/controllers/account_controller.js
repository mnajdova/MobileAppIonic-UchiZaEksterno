controllers.controller('AccountCtrl', function($scope, fireBaseData, $firebase, $timeout, $localstorage, $rootScope, $state, fileUpload, $cordovaCamera, $ionicHistory) {
    $scope.data={gettingData:false};

    $scope.removeStudentProfile = function(name){
        console.log($scope.studentsProfiles);
        var updatedStudentProfiles = [];
        for(var i=0;i<$scope.studentsProfiles.length;i++){
            if($scope.studentsProfiles[i]['name'] != name){
                updatedStudentProfiles.push($scope.studentsProfiles[i]);
            }
        }
        $timeout(function(){
            $scope.studentsProfiles = updatedStudentProfiles;
            $localstorage.setObject('studentsProfiles', $scope.studentsProfiles);
        });
    };


    $scope.send = function(){
        var imageURI = $scope.picData;
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        var params = new Object();
        options.params = params;
        options.chunkedMode = false;
        var ft = new FileTransfer();
        ft.upload(imageURI, "http://zor-komerc.mk/uchizaeksterno/upload.php", win, fail,
            options);
    }

    function win(r) {
        var pictureUrl = r.response;
        $scope.loggedUser = $localstorage.getObject('user');
        $scope.loggedUser['picture_url'] = pictureUrl;
        $scope.data.gettingData = false;
        $localstorage.setObject('user', $scope.loggedUser);
        var pictureRef = fireBaseData.usersRef().child($scope.loggedUser.$id).child('picture_url');
        pictureRef.set(pictureUrl, function(){
            $scope.data.gettingData = false;
            $timeout(function(){
                $scope.loggedUser['picture_url'] = pictureUrl;
                var alertPopup = $ionicPopup.alert({
                    title: 'Успешна промена',
                    template: 'Вашата фотографија беше успешно прикачена',
                    buttons: [
                        {text: 'OK',
                            type: 'button-calm'
                        }
                    ]
                });
            })
        });

    }

    function fail(error) {
        $scope.data.gettingData = false;
        var alertPopup = $ionicPopup.alert({
            title: 'Настана грешка',
            template: 'Се појави грешка при прикачувањето на вашата фотографија. Ве молиме обидете се повторно.',
            buttons: [
                {text: 'OK',
                    type: 'button-calm'
                }
            ]
        });
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }

    $scope.takePic = function(type) {
        var sourceType;
        if(type == 0){
            sourceType = Camera.PictureSourceType.CAMERA;
        }
        else
            sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
        var options = {
            quality : 100,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType : sourceType,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 500,
            targetHeight: 500,
            saveToPhotoAlbum: false
        };
        navigator.camera.getPicture(onSuccess,onFail,options);
    }
    var onSuccess = function(FILE_URI) {
        console.log(FILE_URI);
        $scope.picData = FILE_URI;
        $scope.data.gettingData = true;
        $scope.send();
    };

    var onFail = function(e) {
        var alertPopup = $ionicPopup.alert({
            title: 'Настана грешка',
            template: 'Фотоградијата не беше успешно прикачена. Ве молиме обидете се повторно.',
            buttons: [
                {text: 'OK',
                    type: 'button-calm'
                }
            ]
        });
        console.log("On fail " + e);
    };

    $scope.studentsProfiles = $localstorage.getObject('studentsProfiles');
    console.log($scope.studentsProfiles);

    $scope.choosenStudentProfile = function(name){
        for(var i=0; i< $scope.studentsProfiles.length;i++){
            if(name == $scope.studentsProfiles[i].name){
                $localstorage.setObject('selectedSubjectsIds', $scope.studentsProfiles[i].subjects);
                $state.transitionTo("tab.selectedSubjects", {}, {reload: true, inherit: false, notify: true});
            }
        }
    };

    $scope.addNewProfile = function(){
        $state.transitionTo("tab.schoolPrograms", {}, {reload: true, inherit: false, notify: true});
    };

    if(JSON.stringify($localstorage.getObject('user')) === '{}'){
        $scope.showLoginForm = true;
    }
    else{
        $scope.loggedUser = $localstorage.getObject('user');
    }
    if($rootScope.shouldGoTo=="chat"){
        $state.transitionTo("tab.chats", {}, {
            reload: true,
            inherit: false,
            notify: true
        });
        $rootScope.shouldGoTo = "account";
    }

    $scope.loginWithFacebook = function(){
        window.open = cordova.InAppBrowser.open;
        var ref = fireBaseData.appRef();

        ref.authWithOAuthPopup("facebook", function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);

                console.log("id: "+authData.auth.uid);
                console.log("first_name: "+authData.facebook.cachedUserProfile.first_name);
                console.log("last_name: "+authData.facebook.cachedUserProfile.last_name);
                console.log("picture_url: "+authData.facebook.cachedUserProfile.picture.data.url);

                var users = fireBaseData.usersRef();
                var usersArray = $firebase(users).$asArray();

                usersArray.$loaded(function(list){
                    var user = list.$getRecord(authData.auth.uid);
                    console.log("pred localstorage");
                    $localstorage.setObject('user', {
                        $id: authData.auth.uid,
                        first_name: authData.facebook.cachedUserProfile.first_name,
                        last_name: authData.facebook.cachedUserProfile.last_name,
                        picture_url: authData.facebook.cachedUserProfile.picture.data.url
                    });

                    if(user==null){

                        users.child(authData.auth.uid).set({
                            first_name: authData.facebook.cachedUserProfile.first_name,
                            last_name: authData.facebook.cachedUserProfile.last_name,
                            picture_url: authData.facebook.cachedUserProfile.picture.data.url
                        }, function(err){
                            if($rootScope.invoker == 'chats') {
                                $state.transitionTo("tab.chats", {}, {
                                    reload: true,
                                    inherit: false,
                                    notify: true
                                });
                                $rootScope.invoker="";
                            }
                            else
                                addChatroomIfNeeded();
                        });

                    }
                    else{
                        console.log("================Rootscope question============="+JSON.stringify($rootScope.question));
                        if($rootScope.invoker == 'chats') {
                            $state.transitionTo("tab.chats", {}, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                            $rootScope.invoker="";
                        }
                        else
                            addChatroomIfNeeded();
                    }

                    $scope.loggedUser = $localstorage.getObject('user');

                    $scope.showLoginForm = false;




                    delete window.open;

                });


            }

        });
    };

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
                    });

                    $state.transitionTo("tab.chats", {}, {
                        reload: true,
                        inherit: false,
                        notify: true
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

                            $state.transitionTo("tab.chats", {}, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        }
                    })
                }
            });
        }
    }

    $scope.logout = function(){
        $localstorage.setObject('user', {});
        if(JSON.stringify($localstorage.getObject('user'))=="{}"){
            console.log("OK");
            $scope.showLoginForm = true;
        }
        $rootScope.chatPage = "tab.chat";
    }
});