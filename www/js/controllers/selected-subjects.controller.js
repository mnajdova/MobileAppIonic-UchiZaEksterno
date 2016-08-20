angular.module('starter.controllers').controller('SelectedSubjectsCtrl', function($scope, $timeout, fireBaseData, $firebase, $localstorage, $ionicPopup, $state, $ionicLoading, $rootScope) {

    if(JSON.stringify($localstorage.getObject('selectedSubjectsIds'))=="{}"){
        $state.go('tab.schoolPrograms');
    }

    $scope.gettingData = true;
    $scope.refreshShow = false;

    $scope.getData = getData;
    $scope.refresh = refresh;
    $scope.showSelectedSubject = showSelectedSubject;
    $scope.openQuestions = openQuestions;

    //For mobile
    $timeout(function () {
        $scope.getData();
    }, 1500);


    function getData() {
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

    function refresh() {
        $scope.refreshShow = false;
        $scope.gettingData = true;
        $scope.getData();
    };

    //For testing on computer
    //var selectedSubjectsIds = $localstorage.getObject('selectedSubjectsIds');
    //$scope.selectedSubjects= Array();
    //var subjects = fireBaseData.subjectsRef();
    //subjects.$loaded(function(list){
    //    for(var i=0; i<selectedSubjectsIds.length;i++){
    //        $scope.selectedSubjects.push(list[selectedSubjectsIds[i]]);
    //    }
    //    $scope.gettingData = false;
    //});


    function showSelectedSubject(id){
        $scope.choise = id;
        $localstorage.set('choiseId', id);
    };

    function openQuestions(choise){
        $state.go('tab.questions', {'subjectId' : choise});
    }
});