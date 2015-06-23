controllers.controller('YearsOfStudyCtrl', function($scope, $timeout, fireBaseData, transferList, $firebase, $localstorage, $ionicPopup, $state, $ionicLoading, $rootScope) {

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
                var listYearsOfStudyIds = $localstorage.getObject('yearsOfStudyIds');
                $scope.yearsOfStudy= Array();
                var yearsOfStudy = fireBaseData.yearsOfStudyRef();
                yearsOfStudy.$loaded(function(list){
                    for(var i=0; i<listYearsOfStudyIds.length;i++){
                        $scope.yearsOfStudy.push(list[listYearsOfStudyIds[i]]);
                    }
                    $scope.refreshShow = false;
                    $scope.gettingData = false;
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
    //var listYearsOfStudyIds = $localstorage.getObject('yearsOfStudyIds');
    //$scope.yearsOfStudy= Array();
    //var yearsOfStudy = fireBaseData.yearsOfStudyRef();
    //yearsOfStudy.$loaded(function(list){
    //    for(var i=0; i<listYearsOfStudyIds.length;i++){
    //        $scope.yearsOfStudy.push(list[listYearsOfStudyIds[i]]);
    //    }
    //    $scope.gettingData = false;
    //});

    $scope.choosenYearOfStudy = function(id){
        $localstorage.set('yearOfStudyId', id);
        var index = 0;
        for(var i=0;i<$scope.yearsOfStudy.length;i++){
            if($scope.yearsOfStudy[i].$id == id){
                index = i;
            }
        }
        var listEducationPlansIds = $scope.yearsOfStudy[index]["education-plans"];
        console.log(listEducationPlansIds);
        transferList.setEducationPlans(listEducationPlansIds);
        $localstorage.setObject('educationPlansIds', transferList.getEducationPlans());
        $state.transitionTo("tab.educationPlans", {}, {reload: true, inherit: false, notify: true});
    };
});