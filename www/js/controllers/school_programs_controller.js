controllers.controller('SchoolProgramsCtrl', function($scope, fireBaseData, $firebase, transferList, $localstorage, $ionicPopup, $state, $ionicLoading, $rootScope) {
    $scope.gettingData = true;

    var scoolPrograms = fireBaseData.schoolProgramsRef();

    scoolPrograms.$loaded(function(list){
        $scope.gettingData = false;
        $scope.schoolPrograms = list;
    });

    $scope.choosenLanguage = function(id){
        $localstorage.set('schoolProgramId', id);
        var listTypesOfEducationsIds = $scope.schoolPrograms[id]["types-of-education"];
        transferList.setTypesOfEducations(listTypesOfEducationsIds);
        $localstorage.setObject('typesOfEducationIds', transferList.getTypesOfEducations());
        $state.transitionTo("tab.typesOfEducations", {}, {reload: true, inherit: false, notify: true});
    };
});