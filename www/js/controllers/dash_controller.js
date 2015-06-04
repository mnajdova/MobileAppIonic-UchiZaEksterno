controllers.controller('DashCtrl', function($scope, fireBaseData, $firebase, $localstorage, $ionicPopup, $state, $ionicLoading, $rootScope) {
    $rootScope.invoker="";//default
    $rootScope.question = {};//default
    $rootScope.noUserPictreUrl = "http://icons.iconarchive.com/icons/icons8/ios7/256/Users-User-Male-2-icon.png";



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
    });


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
});
