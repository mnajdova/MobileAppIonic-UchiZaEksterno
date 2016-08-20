angular.module('starter.controllers').controller('SchoolProgramsCtrl', function ($scope, fireBaseData, $timeout, $firebase, transferList, $localstorage, $ionicPopup, $state, $ionicLoading, $rootScope) {
    $scope.gettingData = true;
    $scope.refreshShow = false;
    $scope.schoolPrograms = [];

    $scope.getData = getData;
    $scope.refresh = refresh;
    $scope.choosenLanguage = choosenLanguage;

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
                var schoolPrograms = fireBaseData.schoolProgramsRef();

                schoolPrograms.$loaded(function (list) {
                    $scope.gettingData = false;
                    $scope.schoolPrograms = list;
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
    //var schoolPrograms = fireBaseData.schoolProgramsRef();
    //
    //schoolPrograms.$loaded(function (list) {
    //    $scope.gettingData = false;
    //    $scope.schoolPrograms = list;
    //});

    function choosenLanguage(id) {
        $localstorage.set('schoolProgramId', id);
        var index = 0;
        for(var i=0;i<$scope.schoolPrograms.length;i++){
            if($scope.schoolPrograms[i].$id == id){
                index = i;
            }
        }
        var listTypesOfEducationsIds = $scope.schoolPrograms[index]["types-of-education"];
        transferList.setTypesOfEducations(listTypesOfEducationsIds);
        $localstorage.setObject('typesOfEducationIds', transferList.getTypesOfEducations());
        $state.transitionTo("tab.typesOfEducations", {}, {reload: true, inherit: false, notify: true});
    };
});