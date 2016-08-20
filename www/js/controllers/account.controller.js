angular.module('starter.controllers').controller('AccountCtrl', function ($scope, fireBaseData, $ionicPopup, $firebaseArray, $timeout, $localstorage, $rootScope, $state, fileUpload, $cordovaCamera, $ionicHistory) {

    $scope.data = {gettingData: false};
    $scope.removeStudentProfile = removeStudentProfile;
    $scope.send = send;
    $scope.takePic = takePic;
    $scope.logout = logout;
    $scope.login = login;
    $scope.loginWithFacebook = loginWithFacebook;
    $scope.refresh = refresh;

    var uploadUrl = 'http://zor-komerc.mk/uchizaeksterno/upload.php';

    function removeStudentProfile(name) {
        var updatedStudentProfiles = [];
        for (var i = 0; i < $scope.studentsProfiles.length; i++) {
            if ($scope.studentsProfiles[i]['name'] != name) {
                updatedStudentProfiles.push($scope.studentsProfiles[i]);
            }
        }
        $timeout(function () {
            $scope.studentsProfiles = updatedStudentProfiles;
            $localstorage.setObject('studentsProfiles', $scope.studentsProfiles);
        });
    };


    function send() {
        var imageURI = $scope.picData;
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        var params = new Object();
        options.params = params;
        options.chunkedMode = false;
        var ft = new FileTransfer();
        ft.upload(imageURI, uploadUrl, win, fail,
            options);
    };

    function win(r) {
        var pictureUrl = r.response;
        $scope.loggedUser = $localstorage.getObject('user');
        $scope.loggedUser['picture_url'] = pictureUrl;
        $scope.data.gettingData = false;
        $localstorage.setObject('user', $scope.loggedUser);
        var pictureRef = fireBaseData.usersRef().child($scope.loggedUser.$id).child('picture_url');
        pictureRef.set(pictureUrl, function () {
            $scope.data.gettingData = false;
            $timeout(function () {
                $scope.loggedUser['picture_url'] = pictureUrl;
                var alertPopup = $ionicPopup.alert({
                    title: 'Успешна промена',
                    template: 'Вашата фотографија беше успешно прикачена',
                    buttons: [
                        {
                            text: 'OK',
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
                {
                    text: 'OK',
                    type: 'button-calm'
                }
            ]
        });
    }

    function takePic(type) {
        var sourceType;
        if (type == 0) {
            sourceType = Camera.PictureSourceType.CAMERA;
        }
        else
            sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: sourceType,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 500,
            targetHeight: 500,
            saveToPhotoAlbum: false
        };
        navigator.camera.getPicture(onSuccess, onFail, options);
    }

    var onSuccess = function (FILE_URI) {
        $scope.picData = FILE_URI;
        $scope.data.gettingData = true;
        $scope.send();
    };

    var onFail = function (e) {
        var alertPopup = $ionicPopup.alert({
            title: 'Настана грешка',
            template: 'Фотоградијата не беше успешно прикачена. Ве молиме обидете се повторно.',
            buttons: [
                {
                    text: 'OK',
                    type: 'button-calm'
                }
            ]
        });
    };

    $scope.studentsProfiles = $localstorage.getObject('studentsProfiles');
    $scope.choosenStudentProfile = choosenStudentProfile;

    function choosenStudentProfile(name) {
        for (var i = 0; i < $scope.studentsProfiles.length; i++) {
            if (name == $scope.studentsProfiles[i].name) {
                $localstorage.setObject('selectedSubjectsIds', $scope.studentsProfiles[i].subjects);
                $state.transitionTo("tab.selectedSubjects", {}, {reload: true, inherit: false, notify: true});
            }
        }
    };

    $scope.addNewProfile = addNewProfile;

    function addNewProfile() {
        $state.transitionTo("tab.schoolPrograms", {}, {reload: true, inherit: false, notify: true});
    };

    if (JSON.stringify($localstorage.getObject('user')) === '{}') {
        $scope.showLoginForm = true;
    }
    else {
        $scope.loggedUser = $localstorage.getObject('user');
    }
    if ($rootScope.shouldGoTo == "chat") {
        $rootScope.shouldGoTo = "account";
        $state.transitionTo("tab.chats", {}, {
            reload: true,
            inherit: false,
            notify: true
        });
    }

    function refresh() {
        $scope.refreshShow = false;
        $scope.gettingData = true;
        $scope.login();
    };

    function loginWithFacebook(){
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
                $scope.login();
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

    function login() {
        window.open = cordova.InAppBrowser.open;
        var ref = fireBaseData.appRef();

        ref.authWithOAuthPopup("facebook", function (error, authData) {
            if (error) {
                $ionicPopup.alert({
                    title: 'Неуспешна најава',
                    template: 'Најавата не беше успешна! Ве молиме обидете се повторно',
                    buttons: [
                        {
                            text: 'OK',
                            type: 'button-calm'
                        }
                    ]
                });
            } else {

                var users = fireBaseData.usersRef();
                var usersArray = $firebaseArray(users);

                usersArray.$loaded(function (list) {
                    var user = list.$getRecord(authData.auth.uid);

                    $localstorage.setObject('user', {
                        $id: authData.auth.uid,
                        first_name: authData.facebook.cachedUserProfile.first_name,
                        last_name: authData.facebook.cachedUserProfile.last_name,
                        picture_url: authData.facebook.cachedUserProfile.picture.data.url
                    });

                    if (user == null) {

                        users.child(authData.auth.uid).set({
                            first_name: authData.facebook.cachedUserProfile.first_name,
                            last_name: authData.facebook.cachedUserProfile.last_name,
                            picture_url: authData.facebook.cachedUserProfile.picture.data.url
                        }, function (err) {
                            if ($rootScope.invoker == 'chats') {
                                $rootScope.invoker = "account";
                                $state.transitionTo("tab.chats", {}, {
                                    reload: true,
                                    inherit: false,
                                    notify: true
                                });
                            }
                            else if ($rootScope.invoker == "questions"){
                                $rootScope.invoker = "account";
                                addChatroom();
                            }
                        });

                    }
                    else {
                        if ($rootScope.invoker == "chats") {
                            $rootScope.invoker = "account";
                            $state.transitionTo("tab.chats", {}, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        }
                        else if ($rootScope.invoker == "questions")
                            addChatroom();
                    }

                    $scope.loggedUser = $localstorage.getObject('user');

                    $scope.showLoginForm = false;


                    delete window.open;

                });


            }

        });
    };

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
                });

                $state.transitionTo("tab.chats", {}, {
                    reload: true,
                    inherit: false,
                    notify: true
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

    function logout() {
        $localstorage.setObject('user', {});
        if (JSON.stringify($localstorage.getObject('user')) == "{}") {
            $scope.showLoginForm = true;
        }
        $rootScope.chatPage = "tab.chat";
    }
});