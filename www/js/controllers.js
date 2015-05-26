angular.module('starter.controllers', ['ionic.utils'])

.controller('DashCtrl', function($scope, fireBaseData, $firebase, $localstorage, $ionicPopup, $state, $ionicLoading) {

        $ionicLoading.show({
            template: '<i class="button-icon icon ion-loading-b"></i><style>.loading{background-color: inherit !important; } </style>'
        });

        //$scope.schoolPrograms = $firebase(fireBaseData.refSchoolPrograms()).$asArray();

        var reference = fireBaseData.refSchoolPrograms();
        reference.on("value", function(snapshot) {
            $ionicLoading.hide();
            console.log(snapshot.val());
            $scope.schoolPrograms = snapshot.val();
        });


        $scope.choosenLanguage = function(language){
            console.log(language +" e izbran");
            console.log("The length is "+$scope.schoolPrograms.length);
            for(var i=0;i<$scope.schoolPrograms.length;i++){
                console.log($scope.schoolPrograms[i]["language"]);
                if($scope.schoolPrograms[i]["language"] == language){
                    console.log("Izbran e indeks "+i);
                    $scope.typesOfEducation = $scope.schoolPrograms[i]["types-of-education"];
                    console.log($scope.typesOfEducation);
                    $localstorage.set('language', language);
                }
            }
            $scope.showSchoolPrograms = false;
            $scope.showTypesEducation = true;
        };

        $scope.choosenTypeOfEducation = function(name){
            console.log(name +" e izbran");
            for(var i=0;i<$scope.typesOfEducation.length;i++) {
                if ($scope.typesOfEducation[i]["name"] == name) {
                    $scope.yearsOfStudy = $scope.typesOfEducation[i]["years-of-study"];
                    $localstorage.set('typeOfEducation', name);
                }
            }
            $scope.showTypesEducation = false;
            $scope.showYearsOfStudy = true;
        };

        $scope.choosenYearOfStudy = function(name){
            console.log(name +" e izbran");
            for(var i=0;i<$scope.yearsOfStudy.length;i++) {
                if ($scope.yearsOfStudy[i]["name"] == name) {
                    $scope.educationPlans = $scope.yearsOfStudy[i]["education-plans"];
                    $localstorage.set('yearOfStudy', name);
                }
            }
            $scope.showYearsOfStudy = false;
            $scope.showEducationPlans = true;
        };

        $scope.choosenEducationPlan = function(name){
            console.log(name +" e izbran");
            for(var i=0;i<$scope.educationPlans.length;i++) {
                if ($scope.educationPlans[i]["name"] == name) {
                    $scope.subjects = $scope.educationPlans[i]["subjects"];
                    $localstorage.set('educationPlan', name);
                }
            }
            $scope.showEducationPlans = false;
            $scope.showSubjects = true;
            $localstorage.setObject('subjects', $scope.subjects);
            console.log($localstorage.getObject('subjects'));
        };

        if (checkSelectionOfStudentProfile()) {
            console.log("tuka");
            $scope.showSchoolPrograms = false;
            $scope.showTypesEducation = false;
            $scope.showEducationPlans = false;
            $scope.showYearsOfStudy = false;
            $scope.showSubjects = false;
            $scope.showSelectedSubjects=true;
            $scope.showQuestions=false;

            $scope.selectedSubjects = $localstorage.getObject('selectedSubjectsNames');

            var reference = fireBaseData.refSchoolPrograms();
            reference.on("value", function(snapshot) {
                $ionicLoading.hide();
                console.log(snapshot.val());
                $scope.schoolPrograms = snapshot.val();

                $scope.choosenLanguage($localstorage.get("language"));
                $scope.choosenTypeOfEducation($localstorage.get("typeOfEducation"));
                $scope.choosenYearOfStudy($localstorage.get('yearOfStudy'));
                $scope.choosenEducationPlan($localstorage.get('educationPlan'));

                $scope.showSchoolPrograms = false;
                $scope.showTypesEducation = false;
                $scope.showEducationPlans = false;
                $scope.showYearsOfStudy = false;
                $scope.showSubjects = false;
                $scope.showSelectedSubjects=true;
                $scope.showQuestions=false;

            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });

            for (var i = 0; i < $scope.selectedSubjects.length; i++) {
                console.log($scope.selectedSubjects[i]);
            }

        }
        else {
            $scope.showSchoolPrograms = true;
            $scope.selected=[];
            $scope.selectedSubjects=[];
        }

        //console.log( $scope.schoolPrograms);
        //console.log($localstorage.getObject('user').id);

		//$scope.loggedUser = $localstorage.getObject('user');
		//$scope.userId=""+$scope.loggedUser.id+"";

        $scope.showSelected = function() {
            $scope.selectedSubjects=[];
            for(key in $scope.selected){
                console.log(key);
                $scope.selectedSubjects.push(key);
            }

            console.log($scope.selectedSubjects);
            $scope.showSubjects = false;
            $scope.showSelectedSubjects=true;

            $localstorage.setObject('selectedSubjectsNames', $scope.selectedSubjects);
        };

        $scope.showSelectedSubject = function(subject){
            $scope.choise = subject;
            console.log(subject);
            $localstorage.set('choise', subject);
        };

        $scope.getQuestions = function() {

            console.log("Konecno " + $scope.choise);
            console.log($localstorage.getObject('subjects'));
            if ( typeof $scope.subjects === 'undefined') {
                console.log("Se zema od local storage");
                $scope.subjects = $localstorage.getObject('subjects');
            }

            for(var i=0;i<$scope.subjects.length;i++) {
                console.log("In loop");
                if ($scope.subjects[i]["name"] == $scope.choise) {
                    console.log("Name "+$scope.subjects[i]["name"]);
                    console.log("Choise "+$scope.choise);
                    $scope.questions = $scope.subjects[i]["questions"];
                }
            }
            console.log($scope.questions);
            $scope.index = 0;
            $scope.question = $scope.questions[$scope.index];
            console.log($scope.questions);
            $scope.showSelectedSubjects=false;
            $scope.showQuestions=true;
        };

        $scope.nextQuestion = function(){
            var nextIndex = ($scope.index+1) % $scope.questions.length
            $scope.question = $scope.questions[nextIndex];
            $scope.index = nextIndex;
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


            //console.log($localstorage.getObject('user'));

            $scope.user = fireBaseData.ref().getAuth();
            if($scope.user != null){
                $localstorage.setObject('user', $scope.user);
                $state.go("tab.chats");
            }
            else {

                $scope.myPopup = $ionicPopup.show({
                    template: '<button class="button button-full button-positive" ng-click="saveAndClose();">Facebook</button>',
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

                console.log("After login");
                $scope.user = fireBaseData.ref().getAuth();
                console.log($scope.user);
                if($scope.user != null){
                    $localstorage.setObject('user', $scope.user);
                    $state.go("tab.chats");
                }
            }
        };


        $scope.saveAndClose = function(){
            console.log("faceboook");
            $scope.myPopup.close();


            console.log($localstorage.getObject('user'));
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
                        console.log(authData);
                        $localstorage.setObject('user', authData["facebook"]["cachedUserProfile"]);
                        console.log("stored");
                        console.log($localstorage.getObject('user'));
                        $scope.loggedUser = authData["facebook"]["cachedUserProfile"];
                        $state.go("tab.chats");
                    }

                });

            }
            else{
                $scope.loggedUser = $localstorage.getObject('user');
                console.log($scope.loggedUser.id);
            }
        }




        function checkSelectionOfStudentProfile(){
            console.log("Povikana checkSelection");

            console.log( $localstorage.getObject('selectedSubjectsNames'));
            console.log( $localstorage.get('language') +"\n"+
                $localstorage.get('typeOfEducation') +"\n"+
                $localstorage.get('yearOfStudy') +"\n"+
                $localstorage.get('educationPlan') +"\n"+
                $localstorage.getObject('selectedSubjectsNames') +"\n"+
                $localstorage.getObject('selectedSubjectsNames').length);

            if( typeof $localstorage.get('language') === 'undefined' ||
                typeof $localstorage.get('typeOfEducation') === 'undefined' ||
                typeof $localstorage.get('yearOfStudy') === 'undefined' ||
                typeof $localstorage.get('educationPlan') === 'undefined' ||
                typeof $localstorage.getObject('selectedSubjectsNames') === 'undefined' ||
                $localstorage.getObject('selectedSubjectsNames').length < 1){
                    return false;
            }
            return true;
        }
})
.controller('ChatsCtrl', function($scope, fireBaseData, $firebase, $localstorage, Chats, $stateParams) {

        $scope.chats = Chats.all();
        $scope.remove = function(chat) {
            Chats.remove(chat);
        }
})
    .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })
.controller('AccountCtrl', function($scope, fireBaseData, $firebase, $localstorage) {

		console.log($localstorage.getObject('user'));
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
		}

});