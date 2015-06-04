controllers.controller('EducationPlansCtrl', function($scope, fireBaseData, $firebase, transferList, $localstorage, $ionicPopup, $state, $ionicLoading, $rootScope) {

    $scope.gettingData = true;

    var listEducationPlansIds = $localstorage.getObject('educationPlansIds');
    $scope.educationPlans= Array();
    var educationPlans = fireBaseData.educationPlansRef();
    educationPlans.$loaded(function(list){
        for(var i=0; i<listEducationPlansIds.length;i++){
            $scope.educationPlans.push(list[listEducationPlansIds[i]]);
        }
        $scope.gettingData = false;
    });

    $scope.choosenEducationPlan = function(id){
        $localstorage.set('educationPlanId', id);
        var listSubjectsIds = $scope.educationPlans[id]["subjects"];
        transferList.setSubjects(listSubjectsIds);
        $localstorage.setObject('subjectsIds', transferList.getSubjects());
        $state.transitionTo("tab.subjects", {}, {reload: true, inherit: false, notify: true});
    };

});