angular.module('starter.controllers', ['ionic.utils']).
controller('QuestionsCtrl', function($scope, fireBaseData, $firebase, $localstorage, $ionicPopup, $state, $ionicLoading, $ionicHistory, $location, $rootScope) {
        var array = $location.path().split("/");
        $scope.choise = array[array.length - 1];
        console.log(array[array.length - 1]);

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
                console.log($scope.question);

            })
        })

        $scope.nextQuestion = function () {
            var nextIndex = ($scope.index + 1) % $scope.questions.length;
            $scope.question = $scope.questions[nextIndex];
            $scope.index = nextIndex;
            console.log($scope.question);
        };

        $scope.prevQuestion = function () {
            var prevIndex = 0;
            if ($scope.index == 0)
                prevIndex = $scope.questions.length - 1;
            else
                prevIndex = $scope.index - 1;
            $scope.question = $scope.questions[prevIndex];

            $scope.index = prevIndex;

            console.log($scope.question);
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
                            chatrooms: [parseInt($scope.question.$id)]
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
                                    console.log($scope.question.$id);
                                    console.log(listChatrooms[i].$value);
                                    if (listChatrooms[i].$value == parseInt($scope.question.$id)) {
                                        contains = true;
                                        console.log("Go najde");
                                        break;
                                    }
                                }
                                if (contains == false) {
                                    console.log("ne postoese");
                                    users.child($localstorage.getObject('user').$id).child("chatrooms").child(listChatrooms.length).set(parseInt($scope.question.$id));
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
                                    chatrooms: [parseInt($scope.question.$id)]
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
                        $rootScope.question = $scope.question;
                        console.log($rootScope.question);
                    }
                });
            }
        };
})
.controller('DashCtrl', function($scope, fireBaseData, $firebase, $localstorage, $ionicPopup, $state, $ionicLoading, $rootScope) {
        $rootScope.invoker="";//default
        $rootScope.question = {};//default
        $rootScope.noUserPictreUrl = "https://photos-2.dropbox.com/t/2/AAAOehbC9MCl35ZoFVnc1gAx1DBKrMkW6wQfNWhuEtT7yg/12/116819795/png/32x32/1/_/1/2/Users-User-Male-icon.png/CNOO2jcgASACIAMgBCAFIAYgBygBKAI/RWAwanIYXIPanioHhn4MRyh2QcPUXatXFDudKhoDoCQ?size=1024x768&size_mode=2"

        function showLoading(){
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner><style>.loading{background-color: inherit !important; } </style>'
            });
        }

        function hideLoading(){
            $ionicLoading.hide();
        }

        showLoading();

        $scope.$parent.wasChatLoaded=false;

        var scoolPrograms = fireBaseData.schoolProgramsRef();

        scoolPrograms.$loaded(function(list){
            $ionicLoading.hide();
            $scope.schoolPrograms = list;
            console.log($scope.schoolPrograms);
        })


        $scope.choosenLanguage = function(id){
            showLoading();
            $localstorage.set('schoolProgramId', id);
            var listTypesOfEducationsIds = $scope.schoolPrograms[id]["types-of-education"];
            $scope.typesOfEducation= Array();
            var typesOfEducations = fireBaseData.typesOfEducationRef();
            typesOfEducations.$loaded(function(list){
                for(var i=0; i<listTypesOfEducationsIds.length;i++){
                    $scope.typesOfEducation.push(list[listTypesOfEducationsIds[i]]);
                }
                hideLoading();
            })
            $scope.showSchoolPrograms = false;
            $scope.showTypesEducation = true;
        };

        $scope.choosenTypeOfEducation = function(id){
            showLoading();
            $localstorage.set('typeOfEducationId', id);
            var listYearsOfStudyIds = $scope.typesOfEducation[id]["years-of-study"];
            $scope.yearsOfStudy= Array();
            var yearsOfStudy = fireBaseData.yearsOfStudyRef();
            yearsOfStudy.$loaded(function(list){
                for(var i=0; i<listYearsOfStudyIds.length;i++){
                    $scope.yearsOfStudy.push(list[listYearsOfStudyIds[i]]);
                }
                hideLoading();
            })
            $scope.showTypesEducation = false;
            $scope.showYearsOfStudy = true;
        };

        $scope.choosenYearOfStudy = function(id){
            showLoading();
            $localstorage.set('yearOfStudyId', id);
            var listEducationPlansIds = $scope.yearsOfStudy[id]["education-plans"];
            $scope.educationPlans= Array();
            var educationPlans = fireBaseData.educationPlansRef();
            educationPlans.$loaded(function(list){
                for(var i=0; i<listEducationPlansIds.length;i++){
                    $scope.educationPlans.push(list[listEducationPlansIds[i]]);
                }
                hideLoading();
            })
            $scope.showYearsOfStudy = false;
            $scope.showEducationPlans = true;
        };

        $scope.choosenEducationPlan = function(id){
            showLoading();
            $localstorage.set('educationPlanId', id);
            var listSubjectsIds = $scope.educationPlans[id]["subjects"];
            $scope.subjects= Array();
            var subjects = fireBaseData.subjectsRef();
            subjects.$loaded(function(list){
                for(var i=0; i<listSubjectsIds.length;i++){
                    $scope.subjects.push(list[listSubjectsIds[i]]);
                }
                hideLoading();
            })
            $scope.showEducationPlans = false;
            $scope.showSubjects = true;
        };

        if (checkSelectionOfStudentProfile()) {
            $scope.showSchoolPrograms = false;
            $scope.showTypesEducation = false;
            $scope.showEducationPlans = false;
            $scope.showYearsOfStudy = false;
            $scope.showSubjects = false;
            $scope.showSelectedSubjects=true;
            $scope.showQuestions=false;

            $scope.selectedSubjectsIds =  $localstorage.getObject('selectedSubjectsIds');
            $scope.selectedSubjects= Array();
            var subjects = fireBaseData.subjectsRef();
            subjects.$loaded(function(list){
                for(var i=0; i<$scope.selectedSubjectsIds.length;i++){
                    $scope.selectedSubjects.push(list[$scope.selectedSubjectsIds[i]]);
                }
                hideLoading();
                $scope.showSchoolPrograms = false;
                $scope.showTypesEducation = false;
                $scope.showEducationPlans = false;
                $scope.showYearsOfStudy = false;
                $scope.showSubjects = false;
                $scope.showSelectedSubjects=true;
                $scope.showQuestions=false;
            })

        }
        else {
            $scope.showSchoolPrograms = true;
            $scope.selected=[];
            $scope.selectedSubjects=[];
        }

        $scope.showSelected = function() {
            $scope.selectedSubjectsIds=[];
            for(key in $scope.selected){
                console.log(key);
                $scope.selectedSubjectsIds.push(key);
            }
            console.log($scope.selectedSubjectsIds);
            $localstorage.setObject('selectedSubjectsIds', $scope.selectedSubjectsIds);

            $scope.selectedSubjects= Array();
            var subjects = fireBaseData.subjectsRef();
            subjects.$loaded(function(list){
                for(var i=0; i<$scope.selectedSubjectsIds.length;i++){
                    $scope.selectedSubjects.push(list[$scope.selectedSubjectsIds[i]]);
                }
                hideLoading();
            })

            $scope.showSubjects = false;
            $scope.showSelectedSubjects=true;
        };

        $scope.showSelectedSubject = function(id){
            $scope.choise = id;
            $localstorage.set('choiseId', id);
        };

        function checkSelectionOfStudentProfile(){
            console.log("Povikana checkSelection");

            console.log( $localstorage.get('schoolProgramId') +"\n"+
                $localstorage.get('typeOfEducationId') +"\n"+
                $localstorage.get('yearOfStudyId') +"\n"+
                $localstorage.get('educationPlanId') +"\n"+
                $localstorage.getObject('selectedSubjectsIds') +"\n"+
                $localstorage.getObject('selectedSubjectsIds').length);

            if( typeof $localstorage.get('schoolProgramId') === 'undefined' ||
                typeof $localstorage.get('typeOfEducationId') === 'undefined' ||
                typeof $localstorage.get('yearOfStudyId') === 'undefined' ||
                typeof $localstorage.get('educationPlanId') === 'undefined' ||
                typeof $localstorage.getObject('selectedSubjectsIds') === 'undefined' ||
                $localstorage.getObject('selectedSubjectsIds').length < 1){
                    return false;
            }
            return true;
        }
})
.controller('ChatsCtrl', function($scope, fireBaseData, $firebase, $localstorage, $stateParams, $ionicLoading, $ionicPopup, $rootScope, $state) {

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
})
.controller('ChatDetailCtrl', function($scope, $timeout, $ionicScrollDelegate, $location, $localstorage, $firebase, $state, $rootScope, fireBaseData, $ionicPlatform) {
        $timeout(function(){
            $ionicScrollDelegate.scrollBottom(false);}
            ,30);

        if(typeof $scope.messages === 'undefined' || $scope.messages.length==0 ) {
            $scope.myId = $localstorage.getObject('user').$id;

            console.log($location.path());
            var array = $location.path().split("/");
            var questionId = array[array.length - 1];
            console.log(array[array.length - 1]);

            var questionRef = fireBaseData.appRef().child("questions").child(parseInt(questionId));
            questionRef.on('value', function (q) {
                var question = q.val();
                console.log(question.text);
                if (typeof question["chatroom"] != 'undefined') {
                    if (typeof question["chatroom"]["messages"] != 'undefined') {
                        var ref = questionRef.child("chatroom").child("messages");
                        ref.on("value", function (snapshot) {
                            $scope.messages = $firebase(ref).$asArray();
                            console.log($scope.messages);
                            $ionicScrollDelegate.resize();
                            $timeout(function() {
                                $ionicScrollDelegate.scrollBottom(true);
                            }, 300);
                        });
                    }
                } else {
                    questionRef.child("chatroom").set({
                        messages: [0]
                    }, function(error){
                        console.log(error);
                        if(error==null){
                            var ref = questionRef.child("chatroom").child("messages");
                            ref.on("value", function (snapshot) {
                                $scope.messages = $firebase(ref).$asArray();
                                console.log($scope.messages);
                                $ionicScrollDelegate.resize();
                                $timeout(function() {
                                    $ionicScrollDelegate.scrollBottom(true);
                                }, 300);


                            });
                        }
                    });
                }

            })
        }



        $timeout(function() {
            $ionicScrollDelegate.scrollBottom(true);
        }, 300);
        $ionicScrollDelegate.resize();

        $scope.myId = $localstorage.getObject('user').$id;

        $scope.hideTime = true;

        var alternate,
            isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

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


            $timeout(function() {
                $ionicScrollDelegate.scrollBottom(true);
            }, 300);
            $ionicScrollDelegate.resize();

        };


        $scope.inputUp = function() {
            if (isIOS) $scope.data.keyboardHeight = 216;
            $timeout(function() {
                $ionicScrollDelegate.scrollBottom(true);
            }, 300);

        };

        $scope.inputDown = function() {
            if (isIOS) $scope.data.keyboardHeight = 0;
            $ionicScrollDelegate.resize();
        };

        $scope.closeKeyboard = function() {
            // cordova.plugins.Keyboard.close();
        };

        $scope.myGoBack = function(){
            $state.go("tab.chats");
        }

        $scope.data = {};

    })
.controller('RegisterCtrl', function($scope, fireBaseData, $firebase, $localstorage, $rootScope, $state, $ionicLoading) {

        function showLoading(){
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner><style>.loading{background-color: inherit !important; } </style>'
            });
        }

        function hideLoading(){
            $ionicLoading.hide();
        }

        if(JSON.stringify($localstorage.getObject('user'))!="{}"){
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

        $scope.errormessage="";
        $scope.registerUser = function (fn, ln, em, pwd) {
            console.log(fn);
            if(typeof fn == 'undefined' || fn==""){
                $scope.errormessage = "Внесете го вашето име.";

            }else if(typeof ln == 'undefined' || ln==""){
                $scope.errormessage = "Внесете го вашето презиме.";

            }else if(typeof em == 'undefined' || em==""){
                $scope.errormessage = "Внесете го вашиот меил.";

            }else if(typeof pwd == 'undefined' || pwd==""){
                $scope.errormessage = "Внесете лозинка.";

            }
            else {
                var ref = new Firebase("https://uchizaeksterno.firebaseio.com");
                showLoading();
                ref.createUser({
                    email: em,
                    password: pwd
                }, function (error, authData) {
                    if (error) {
                        hideLoading();
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
                                        $scope.$apply(function(){
                                            $scope.data = {
                                                fn: "",
                                                ln: "",
                                                em: "",
                                                pwd: ""
                                            };

                                        });
                                        hideLoading();
                                        console.log(JSON.stringify($rootScope.question));
                                        if ($rootScope.invoker == 'chats') {
                                            $state.transitionTo("tab.account", {}, {
                                                reload: true,
                                                inherit: false,
                                                notify: true
                                            });
                                            $rootScope.shouldGoTo = "chat";
                                        }
                                        else if(JSON.stringify($rootScope.question) != "{}" ) {
                                            addChatroomIfNeeded();
                                        }else{
                                            $state.transitionTo("tab.account", {}, {
                                                reload: true,
                                                inherit: false,
                                                notify: true
                                            });
                                            $rootScope.shouldGoTo="account";
                                        }
                                    }
                                );


                            }
                        })

                    }
                });
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
                    console.log(parseInt(question.$id));
                    console.log(typeof user["chatrooms"]);
                    if (typeof user["chatrooms"] === 'undefined') {
                        console.log("The user doesn't exist or had a empty chatrooms");

                        users.child($localstorage.getObject('user').$id).set({
                            first_name: $localstorage.getObject('user').first_name,
                            last_name: $localstorage.getObject('user').last_name,
                            picture_url: $localstorage.getObject('user').picture_url,
                            chatrooms: [parseInt(question.$id)]
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
                                    console.log($scope.question.$id);
                                    console.log(listChatrooms[i]);
                                    if (listChatrooms[i].$value == parseInt(question.$id)) {
                                        contains = true;
                                        break;
                                    }
                                }
                                if (contains == false) {
                                    users.child($localstorage.getObject('user').$id).child("chatrooms").child(listChatrooms.length).set(parseInt(question.$id));
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
    })
.controller('LoginCtrl', function($scope, fireBaseData, $firebase, $localstorage, $rootScope, $state, $ionicLoading) {

        function showLoading(){
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner><style>.loading{background-color: inherit !important; } </style>'
            });
        }

        function hideLoading(){
            $ionicLoading.hide();
        }

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
                showLoading();
                ref.authWithPassword({
                    email: email,
                    password: password
                }, function (error, authData) {
                    if (error) {
                        hideLoading();
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
                            hideLoading();
                            //$scope.$apply(function () {
                                $scope.data = {
                                    email: "",
                                    password: ""
                                };

                           // });

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
                    console.log(parseInt(question.$id));
                    console.log(typeof user["chatrooms"]);
                    if (typeof user["chatrooms"] === 'undefined') {
                        console.log("The user doesn't exist or had a empty chatrooms");

                        users.child($localstorage.getObject('user').$id).set({
                            first_name: $localstorage.getObject('user').first_name,
                            last_name: $localstorage.getObject('user').last_name,
                            picture_url: $localstorage.getObject('user').picture_url,
                            chatrooms: [parseInt(question.$id)]
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
                                    console.log($scope.question.$id);
                                    console.log(listChatrooms[i]);
                                    if (listChatrooms[i].$value == parseInt(question.$id)) {
                                        contains = true;
                                        break;
                                    }
                                }
                                if (contains == false) {
                                    users.child($localstorage.getObject('user').$id).child("chatrooms").child(listChatrooms.length).set(parseInt(question.$id));
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
})
.controller('AccountCtrl', function($scope, fireBaseData, $firebase, $localstorage, $rootScope, $state) {

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
            //window.open = cordova.InAppBrowser.open;
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




                        //delete window.open;

                    });


                }

            });
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
                    console.log(parseInt(question.$id));
                    console.log(typeof user["chatrooms"]);
                    if (typeof user["chatrooms"] === 'undefined') {
                        console.log("The user doesn't exist or had a empty chatrooms");

                        users.child($localstorage.getObject('user').$id).set({
                            first_name: $localstorage.getObject('user').first_name,
                            last_name: $localstorage.getObject('user').last_name,
                            picture_url: $localstorage.getObject('user').picture_url,
                            chatrooms: [parseInt(question.$id)]
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
                                    console.log($scope.question.$id);
                                    console.log(listChatrooms[i]);
                                    if (listChatrooms[i].$value == parseInt(question.$id)) {
                                        contains = true;
                                        break;
                                    }
                                }
                                if (contains == false) {
                                    users.child($localstorage.getObject('user').$id).child("chatrooms").child(listChatrooms.length).set(parseInt(question.$id));
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
        }
});
