angular.module('starter.controllers').controller('EducationPlansCtrl', function($scope, $timeout, fireBaseData, $firebase, transferList, $localstorage, $ionicPopup, $state, $ionicLoading, $rootScope) {

    $scope.gettingData = true;
    $scope.refreshShow = false;

    $scope.getData = getData;
    $scope.refresh = refresh;
    $scope.choosenEducationPlan = choosenEducationPlan;

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

    function refresh() {
        $scope.refreshShow = false;
        $scope.gettingData = true;
        $scope.getData();
    };

    //For testing on computer
    //var listEducationPlansIds = $localstorage.getObject('educationPlansIds');
    //$scope.educationPlans= Array();
    //var educationPlans = fireBaseData.educationPlansRef();
    //educationPlans.$loaded(function(list){
    //    for(var i=0; i<listEducationPlansIds.length;i++){
    //        $scope.educationPlans.push(list[listEducationPlansIds[i]]);
    //    }
    //    $scope.gettingData = false;
    //});

    function choosenEducationPlan(id){
        $localstorage.set('educationPlanId', id);
        var index = 0;
        for(var i=0;i<$scope.educationPlans.length;i++){
           if($scope.educationPlans[i].$id == id){
               index = i;
           }
        }
        var listSubjectsIds = $scope.educationPlans[index]["subjects"];
        transferList.setSubjects(listSubjectsIds);
        $localstorage.setObject('subjectsIds', transferList.getSubjects());
        $state.transitionTo("tab.subjects", {}, {reload: true, inherit: false, notify: true});
    };

});