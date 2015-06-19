controllers.controller('EducationPlansCtrl', function($scope, $timeout, fireBaseData, $firebase, transferList, $localstorage, $ionicPopup, $state, $ionicLoading, $rootScope) {

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
                var listEducationPlansIds = $localstorage.getObject('educationPlansIds');
                $scope.educationPlans= Array();
                var educationPlans = fireBaseData.educationPlansRef();
                educationPlans.$loaded(function(list){
                    for(var i=0; i<listEducationPlansIds.length;i++){
                        $scope.educationPlans.push(list[listEducationPlansIds[i]]);
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
    //var listEducationPlansIds = $localstorage.getObject('educationPlansIds');
    //$scope.educationPlans= Array();
    //var educationPlans = fireBaseData.educationPlansRef();
    //educationPlans.$loaded(function(list){
    //    for(var i=0; i<listEducationPlansIds.length;i++){
    //        $scope.educationPlans.push(list[listEducationPlansIds[i]]);
    //    }
    //    $scope.gettingData = false;
    //});

    $scope.choosenEducationPlan = function(id){
        $localstorage.set('educationPlanId', id);
        var listSubjectsIds = $scope.educationPlans[id]["subjects"];
        transferList.setSubjects(listSubjectsIds);
        $localstorage.setObject('subjectsIds', transferList.getSubjects());
        $state.transitionTo("tab.subjects", {}, {reload: true, inherit: false, notify: true});
    };

});