controllers.controller('SchoolProgramsCtrl', function($scope, fireBaseData, $firebase, transferList, $localstorage, $ionicPopup, $state, $ionicLoading, $rootScope) {
    $rootScope.invoker="";
    $rootScope.question = {};
    $rootScope.noUserPictreUrl = "http://icons.iconarchive.com/icons/icons8/ios7/256/Users-User-Male-2-icon.png";
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