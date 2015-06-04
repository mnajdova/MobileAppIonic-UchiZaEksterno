controllers.controller('YearsOfStudyCtrl', function($scope, fireBaseData, transferList, $firebase, $localstorage, $ionicPopup, $state, $ionicLoading, $rootScope) {

    $scope.gettingData = true;

    var listYearsOfStudyIds = $localstorage.getObject('yearsOfStudyIds');
    $scope.yearsOfStudy= Array();
    var yearsOfStudy = fireBaseData.yearsOfStudyRef();
    yearsOfStudy.$loaded(function(list){
        for(var i=0; i<listYearsOfStudyIds.length;i++){
            $scope.yearsOfStudy.push(list[listYearsOfStudyIds[i]]);
        }
        $scope.gettingData = false;
    });

    $scope.choosenYearOfStudy = function(id){
        $localstorage.set('yearOfStudyId', id);
        var listEducationPlansIds = $scope.yearsOfStudy[id]["education-plans"];
        transferList.setEducationPlans(listEducationPlansIds);
        $localstorage.setObject('educationPlansIds', transferList.getEducationPlans());
        $state.transitionTo("tab.educationPlans", {}, {reload: true, inherit: false, notify: true});
    };
});