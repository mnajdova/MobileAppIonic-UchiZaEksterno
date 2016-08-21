angular.module('starter.controllers').controller('TypesOfEducationsCtrl', function ($scope, $timeout, fireBaseData, transferList, $ionicPlatform, $firebase, $localstorage, $ionicPopup, $state, $ionicLoading, $rootScope) {
    $scope.gettingData = true;
    $scope.refreshShow = false;

    $scope.getData = getData;
    $scope.refresh = refresh;
    $scope.choosenTypeOfEducation = choosenTypeOfEducation;

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
                var listTypesOfEducationsIds = $localstorage.getObject('typesOfEducationIds');
                $scope.typesOfEducation = Array();
                var typesOfEducations = fireBaseData.typesOfEducationRef();
                typesOfEducations.$loaded(function (list) {
                    for (var i = 0; i < listTypesOfEducationsIds.length; i++) {
                        $scope.typesOfEducation.push(list[listTypesOfEducationsIds[i]]);
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
    //var listTypesOfEducationsIds = $localstorage.getObject('typesOfEducationIds');
    //$scope.typesOfEducation= Array();
    //var typesOfEducations = fireBaseData.typesOfEducationRef();
    //typesOfEducations.$loaded(function(list){
    //    for(var i=0; i<listTypesOfEducationsIds.length;i++){
    //        $scope.typesOfEducation.push(list[listTypesOfEducationsIds[i]]);
    //    }
    //    $scope.gettingData = false;
    //});

    function choosenTypeOfEducation(id) {
        $localstorage.set('typeOfEducationId', id);
        var index = 0;
        for(var i=0;i<$scope.typesOfEducation.length;i++){
            if($scope.typesOfEducation[i].$id == id){
                index = i;
            }
        }
        var listYearsOfStudyIds = $scope.typesOfEducation[index]["years-of-study"];
        transferList.setYearsOfStudy(listYearsOfStudyIds);
        $localstorage.setObject('yearsOfStudyIds', transferList.getYearsOfStudy());
        $state.transitionTo("tab.yearsOfStudy", {}, {reload: true, inherit: false, notify: true});
    };
});