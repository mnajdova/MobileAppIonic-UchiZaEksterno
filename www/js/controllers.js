angular.module('starter.controllers', ['ionic.utils'])
    .controller('QuestionsCtrl', function($scope, fireBaseData, $firebase, $localstorage, $ionicPopup, $state, $ionicLoading, $location) {
        var array = $location.path().split("/");
        $scope.choise = array[array.length - 1];
        console.log(array[array.length - 1]);

        var listQuestionsIds=[];

        var subjects = fireBaseData.subjectsRef();
        subjects.$loaded(function(list){
            listQuestionsIds = list[$scope.choise]["questions"];
            console.log(list[$scope.choise]);
            console.log(list);
            $scope.questions= Array();
            var questions = fireBaseData.questionsRef();
            questions.$loaded(function(list){
                for(var i=0; i<listQuestionsIds.length;i++){
                    $scope.questions.push(list[listQuestionsIds[i]]);
                }
                $scope.index = 0;
                $scope.question = $scope.questions[$scope.index];
                console.log($scope.question);

            })
        })

        $scope.nextQuestion = function(){
            var nextIndex = ($scope.index+1) % $scope.questions.length;
            $scope.question = $scope.questions[nextIndex];
            $scope.index = nextIndex;
            console.log(typeof $scope.question['picture-url']);
            console.log($scope.question);
        };

        $scope.prevQuestion = function(){
            var prevIndex = 0;
            if($scope.index==0)
                prevIndex = $scope.questions.length-1;
            else
                prevIndex = $scope.index-1;
            $scope.question = $scope.questions[prevIndex];
            $scope.index = prevIndex;

            console.log($scope.question);
        };

        $scope.joinChatRoom = function(){

            if(JSON.stringify($localstorage.getObject('user')) != "{}"){

                var users = fireBaseData.usersRef();
                var usersArray = $firebase(users).$asArray();

                usersArray.$loaded(function(list){
                    var user = list.$getRecord($localstorage.getObject('user').$id);
                    if(user==null || typeof user["chatrooms"] === 'undefined'){
                        console.log("The user doesn't exist or had a empty chatrooms");

                        users.child(authData.auth.uid).set({
                            first_name: $localstorage.getObject('user').first_name,
                            last_name: $localstorage.getObject('user').last_name,
                            picture_url: $localstorage.getObject('user').picture_url,
                            chatrooms: [parseInt($scope.question.$id)]
                        });

                        $state.go("tab.chats");
                    }
                    else{
                        console.log("The user existed");
                        var chatrooms = $firebase(users.child($localstorage.getObject('user').$id).child("chatrooms")).$asArray();
                        chatrooms.$loaded(function(listChatrooms){
                            console.log("Vo listChatrooms");
                            console.log(listChatrooms.length);
                            if(listChatrooms.length>0) {
                                var contains = false;
                                for(var i=0;i<listChatrooms.length;i++){
                                    console.log($scope.question.$id);
                                    console.log(listChatrooms[i]);
                                    if(listChatrooms[i].$value == parseInt($scope.question.$id)){
                                        contains = true;
                                        break;
                                    }
                                }
                                if (contains == false) {
                                    console.log("ne postoese");
                                    users.child($localstorage.getObject('user').$id).child("chatrooms").child(listChatrooms.length).set(parseInt($scope.question.$id));
                                }

                                $state.go("tab.chats");
                            }
                            else{
                                console.log("prazna");
                            }
                        })
                    }


                });

                $state.go("tab.chats");
            }
            else {

                $scope.myPopup = $ionicPopup.show({
                    template: '<button class="button button-full button-positive" ng-click="logInWithFacebook();">Facebook</button>',
                    title: 'Odberi log in',
                    //subTitle: 'Please use normal things',
                    scope: $scope,
                    buttons: [
                        {
                            text: 'Cancel'
                        }
                    ]
                });

                $scope.myPopup.then(function (res) {
                    console.log('Tapped!', res);
                });

              /*  console.log("After login");
                $scope.user = fireBaseData.ref().getAuth();
                console.log($scope.user);
                if($scope.user != null){
                    $localstorage.setObject('user', $scope.user);
                    $state.go("tab.chats");
                }*/
            }
        };

        $scope.logInWithFacebook = function(){
            console.log("faceboook");
            $scope.myPopup.close();


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
                        if(user==null || typeof user["chatrooms"] === 'undefined'){
                            console.log("The user doesn't exist or had a empty chatrooms");

                            users.child(authData.auth.uid).set({
                                first_name: authData.facebook.cachedUserProfile.first_name,
                                last_name: authData.facebook.cachedUserProfile.last_name,
                                picture_url: authData.facebook.cachedUserProfile.picture.data.url,
                                chatrooms: [parseInt($scope.question.$id)]
                            });
                            $localstorage.setObject('user', {
                                $id: authData.auth.uid,
                                first_name: authData.facebook.cachedUserProfile.first_name,
                                last_name: authData.facebook.cachedUserProfile.last_name,
                                picture_url: authData.facebook.cachedUserProfile.picture.data.url
                            });
                            $state.go("tab.chats");
                        }
                        else{
                            console.log("The user existed");
                            var chatrooms = $firebase(users.child(authData.auth.uid).child("chatrooms")).$asArray();
                            chatrooms.$loaded(function(listChatrooms){
                                console.log("Vo listChatrooms");
                                console.log(listChatrooms.length);
                                if(listChatrooms.length>0) {
                                    var contains = false;
                                    for(var i=0;i<listChatrooms.length;i++){
                                        console.log($scope.question.$id);
                                        console.log(listChatrooms[i]);
                                        if(listChatrooms[i].$value == parseInt($scope.question.$id)){
                                            contains = true;
                                            break;
                                        }
                                    }
                                    if (contains == false) {
                                        console.log("ne postoese");
                                        users.child(authData.auth.uid).child("chatrooms").child(listChatrooms.length).set(parseInt($scope.question.$id));
                                    }
                                    $localstorage.setObject('user', {
                                        $id: authData.auth.uid,
                                        first_name: authData.facebook.cachedUserProfile.first_name,
                                        last_name: authData.facebook.cachedUserProfile.last_name,
                                        picture_url: authData.facebook.cachedUserProfile.picture.data.url
                                    });
                                    console.log($localstorage.getObject('user'));
                                    console.log($localstorage.getObject('user').$id);
                                    console.log($localstorage.getObject('user').chatrooms);
                                    $state.go("tab.chats");
                                }
                                else{
                                    console.log("prazna");
                                }
                            })
                        }

                        delete window.open;

                    });


                }

            });

        }
    })
.controller('DashCtrl', function($scope, fireBaseData, $firebase, $localstorage, $ionicPopup, $state, $ionicLoading) {

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
.controller('ChatsCtrl', function($scope, fireBaseData, $firebase, $localstorage, $stateParams, $ionicLoading) {
        function showLoading(){
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner><style>.loading{background-color: inherit !important; } </style>'
            });
        }

        function hideLoading(){
            $ionicLoading.hide();
        }


        $scope.$parent.wasChatLoaded=false;
        if(JSON.stringify($localstorage.getObject('user')) != "{}") {
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
            })
        }
})
.controller('ChatDetailCtrl', function($scope, $timeout, $ionicScrollDelegate, $location, $localstorage, $firebase, $state, fireBaseData, $ionicPlatform) {

        /*$ionicPlatform.onHardwareBackButton(function() {
            event.preventDefault();
            event.stopPropagation();
            $state.go("tab.chats");
        });*/

        $timeout(function(){
            $ionicScrollDelegate.scrollBottom(false);}
            ,30);

        /*$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
            viewData.shouldAnimate = true;
            console.log(viewData);
        });*/


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
.controller('AccountCtrl', function($scope, fireBaseData, $firebase, $localstorage) {
        /*$scope.$parent.wasChatLoaded=false;

		$scope.loggedUser = $localstorage.getObject('user');

		function isEmptyObject(obj){
			return JSON.stringify(obj) === '{}';
		}

		if(isEmptyObject($localstorage.getObject('user'))){
			var ref = new Firebase("https://blistering-torch-6297.firebaseio.com");
            console.log(ref);
			ref.authWithOAuthPopup("facebook", function(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
			} else {
				console.log("Authenticated successfully with payload:", authData);
				console.log("storing...");
				$localstorage.setObject('user', authData["facebook"]["cachedUserProfile"]);
				console.log("stored");
				console.log($localstorage.getObject('user'));
				$scope.loggedUser = authData["facebook"]["cachedUserProfile"];
			}

			});

		}
		else{
			$scope.loggedUser = $localstorage.getObject('user');
			console.log($scope.loggedUser.id);
		}*/

});