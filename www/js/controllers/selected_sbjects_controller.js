controllers.controller('SelectedSubjectsCtrl', function($scope, $timeout, fireBaseData, $firebase, $localstorage, $ionicPopup, $state, $ionicLoading, $rootScope) {

    if(JSON.stringify($localstorage.getObject('selectedSubjectsIds'))=="{}"){
        $state.go('tab.schoolPrograms');
    }

    $scope.gettingData = true;
    $scope.refreshShow = false;

    //For mobile
    $timeout(function () {
        $scope.getData();
    }, 1500);


    $scope.getData = function () {
        if (window.Connection) {
            if (navigator.connection.type == Connection.NONE) {
                $ionicPopup.confirm({
                    title: "Интернет конекција",
                    content: "Вашата интернет конекција неможе да биде воспоставена. Конектирајте се на интернет и обидете се повторно.",
                    buttons: [
                        {text: 'Откажи'},
                        {
                            text: 'OK',
                            type: 'button-calm'
                        }
                    ]
                }).then(function (result) {
                    $scope.gettingData = false;
                    $scope.refreshShow = true;
                });
            }
            else {
                var selectedSubjectsIds = $localstorage.getObject('selectedSubjectsIds');
                $scope.selectedSubjects= Array();
                var subjects = fireBaseData.subjectsRef();
                subjects.$loaded(function(list){
                    for(var i=0; i<selectedSubjectsIds.length;i++){
                        $scope.selectedSubjects.push(list[selectedSubjectsIds[i]]);
                    }
                    $scope.gettingData = false;
                    $scope.refreshShow = false;
                });
            }
        } else {
            $ionicPopup.confirm({
                title: "Интернет конекција",
                content: "Дисконектирани сте од интернет. Ве молиме конектирајте се за да ги превземете податоците.",
                buttons: [
                    {text: 'Откажи'},
                    {
                        text: 'OK',
                        type: 'button-calm'
                    }
                ]
            }).then(function (result) {
                $scope.gettingData = false;
                $scope.refreshShow = true;
            });
        }
    };

    $scope.refresh = function () {
        $scope.refreshShow = false;
        $scope.gettingData = true;
        $scope.getData();
    };

    //For computer
    //var selectedSubjectsIds = $localstorage.getObject('selectedSubjectsIds');
    //$scope.selectedSubjects= Array();
    //var subjects = fireBaseData.subjectsRef();
    //subjects.$loaded(function(list){
    //    for(var i=0; i<selectedSubjectsIds.length;i++){
    //        $scope.selectedSubjects.push(list[selectedSubjectsIds[i]]);
    //    }
    //    $scope.gettingData = false;
    //});


    $scope.showSelectedSubject = function(id){
        $scope.choise = id;
        $localstorage.set('choiseId', id);
    };

    $scope.openQuestions = function(choise){
        $state.go('tab.questions', {'subjectId' : choise});
    }
});