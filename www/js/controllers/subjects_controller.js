controllers.controller('SubjectsCtrl', function ($scope, fireBaseData, $firebase, $timeout, transferList, $localstorage, $ionicPopup, $state, $ionicLoading, $rootScope) {

    $scope.gettingData = true;
    $scope.selected = [];

    var listSubjectsIds = $localstorage.getObject('subjectsIds');
    $scope.subjects = Array();
    var subjects = fireBaseData.subjectsRef();
    subjects.$loaded(function (list) {
        for (var i = 0; i < listSubjectsIds.length; i++) {
            $scope.subjects.push(list[listSubjectsIds[i]]);
        }
        $scope.gettingData = false;
    });


    $scope.showSelected = function () {
        console.log($scope.selected);
        var choosen = false;
        for(var i=0;i<$scope.selected.length;i++){
            if($scope.selected[i]==true){
                choosen = true;
            }
        }
        if ($scope.selected.length == 0 || choosen == false) {
            var alertPopup = $ionicPopup.alert({
                title: 'Изберете предмет',
                template: 'Ве молиме изберете некои од предметите',
                buttons: [
                    {text: 'OK',
                        type: 'button-calm'
                    }
                ]
            });
        }
        else {

            $scope.selectedSubjectsIds = [];
            for (key in $scope.selected) {
                console.log(key);
                $scope.selectedSubjectsIds.push(key);
            }
            console.log($scope.selectedSubjectsIds);
            $localstorage.setObject('selectedSubjectsIds', $scope.selectedSubjectsIds);

            transferList.setSelectedSubjects($scope.selectedSubjectsIds);


            $scope.studentProfile = {name: "", subjects: $scope.selectedSubjectsIds}
            $scope.error = {message: " "};

            var myPopup = $ionicPopup.show({
                template: '<input type="password" ng-model="data.wifi">',
                title: 'Задолжителна најава',
                template: 'Дали сакате да ги зачувате овие промени? <label class="item item-input"> <span class="input-label">Име</span> <input type="text" ng-model="studentProfile.name"/> </label><label style="margin-top:10px;">{{error.message}}&nbsp;</label>',
                scope: $scope,
                buttons: [
                    {text: 'Cancel'},
                    {
                        text: '<b>Save</b>',
                        type: 'button-calm',
                        onTap: function (e) {
                            if ($scope.studentProfile.name == "") {
                                e.preventDefault();
                                $timeout(function(){
                                    $scope.error.message = "Ве молиме внесете име";
                                });
                            } else {
                                var exist = false;
                                var studentsProfiles = [];
                                if (JSON.stringify($localstorage.getObject('studentsProfiles')) != "{}") {
                                    studentsProfiles = $localstorage.getObject('studentsProfiles');
                                }
                                for(var i=0;i<studentsProfiles.length;i++){
                                    if(studentsProfiles[i].name == $scope.studentProfile.name){
                                        e.preventDefault();
                                        exist = true;
                                        $timeout(function(){
                                            $scope.error.message = "Ова име веќе постои";
                                        });
                                        break;
                                    }
                                }
                                if(exist == false)
                                    return "Save";
                            }
                        }
                    }
                ]
            });


            myPopup.then(function (res) {
                if (res == "Save") {
                    var studentsProfiles = [];
                    if (JSON.stringify($localstorage.getObject('studentsProfiles')) != "{}") {
                        studentsProfiles = $localstorage.getObject('studentsProfiles');
                    }
                    console.log($scope.studentProfile.name);
                    studentsProfiles.push($scope.studentProfile);
                    $localstorage.setObject('studentsProfiles', studentsProfiles);
                    console.log($localstorage.getObject('studentsProfiles'));
                    $state.transitionTo("tab.selectedSubjects", {}, {reload: true, inherit: false, notify: true});
                }
            });
        }
    };
});