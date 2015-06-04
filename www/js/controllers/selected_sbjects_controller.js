controllers.controller('SelectedSubjectsCtrl', function($scope, fireBaseData, $firebase, $localstorage, $ionicPopup, $state, $ionicLoading, $rootScope) {

    function showLoading(){
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner><style>.loading{background-color: inherit !important; } </style>'
        });
    }

    function hideLoading(){
        $ionicLoading.hide();
    }


    showLoading();

    if(JSON.stringify($localstorage.getObject('selectedSubjectsIds'))=="{}"){
        $state.go('tab.schoolPrograms');
    }

    var selectedSubjectsIds = $localstorage.getObject('selectedSubjectsIds');
    $scope.selectedSubjects= Array();
    var subjects = fireBaseData.subjectsRef();
    subjects.$loaded(function(list){
        for(var i=0; i<selectedSubjectsIds.length;i++){
            $scope.selectedSubjects.push(list[selectedSubjectsIds[i]]);
        }
        hideLoading();
    });


    $scope.showSelectedSubject = function(id){
        $scope.choise = id;
        $localstorage.set('choiseId', id);
    };
});