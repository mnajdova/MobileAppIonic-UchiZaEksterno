controllers.controller('SchoolProgramsCtrl', function ($scope, fireBaseData, $timeout, $firebase, transferList, $localstorage, $ionicPopup, $state, $ionicLoading, $rootScope) {
    $scope.gettingData = true;
    $scope.refreshShow = false;
    $scope.schoolPrograms = [];

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

    $scope.refresh = function () {
        $scope.refreshShow = false;
        $scope.gettingData = true;
        $scope.getData();
    };


    //For computer
    //var schoolPrograms = fireBaseData.schoolProgramsRef();
    //
    //schoolPrograms.$loaded(function (list) {
    //    $scope.gettingData = false;
    //    $scope.schoolPrograms = list;
    //});

    $scope.choosenLanguage = function (id) {
        $localstorage.set('schoolProgramId', id);
        var listTypesOfEducationsIds = $scope.schoolPrograms[id]["types-of-education"];
        transferList.setTypesOfEducations(listTypesOfEducationsIds);
        $localstorage.setObject('typesOfEducationIds', transferList.getTypesOfEducations());
        $state.transitionTo("tab.typesOfEducations", {}, {reload: true, inherit: false, notify: true});
    };
});