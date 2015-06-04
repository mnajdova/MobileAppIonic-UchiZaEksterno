controllers.controller('TypesOfEducationsCtrl', function($scope, fireBaseData, transferList,   $ionicPlatform, $firebase, $localstorage, $ionicPopup, $state, $ionicLoading, $rootScope) {

    $scope.gettingData = true;
    var listTypesOfEducationsIds = $localstorage.getObject('typesOfEducationIds');
    $scope.typesOfEducation= Array();
    var typesOfEducations = fireBaseData.typesOfEducationRef();
    typesOfEducations.$loaded(function(list){
        for(var i=0; i<listTypesOfEducationsIds.length;i++){
            $scope.typesOfEducation.push(list[listTypesOfEducationsIds[i]]);
        }
        $scope.gettingData = false;
    });

    $scope.choosenTypeOfEducation = function(id){
        $localstorage.set('typeOfEducationId', id);
        var listYearsOfStudyIds = $scope.typesOfEducation[id]["years-of-study"];
        transferList.setYearsOfStudy(listYearsOfStudyIds);
        $localstorage.setObject('yearsOfStudyIds', transferList.getYearsOfStudy());
        $state.transitionTo("tab.yearsOfStudy", {}, {reload: true, inherit: false, notify: true});
    };
});