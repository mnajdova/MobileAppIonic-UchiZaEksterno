controllers.controller('SubjectsCtrl', function($scope, fireBaseData, $firebase, transferList, $localstorage, $ionicPopup, $state, $ionicLoading, $rootScope) {

    $scope.gettingData = true;
    $scope.selected=[];

    var listSubjectsIds = $localstorage.getObject('subjectsIds');
    $scope.subjects= Array();
    var subjects = fireBaseData.subjectsRef();
    subjects.$loaded(function(list){
        for(var i=0; i<listSubjectsIds.length;i++){
            $scope.subjects.push(list[listSubjectsIds[i]]);
        }
        $scope.gettingData = false;
    });


    $scope.showSelected = function() {
        console.log($scope.selected);
        $scope.selectedSubjectsIds=[];
        for(key in $scope.selected){
            console.log(key);
            $scope.selectedSubjectsIds.push(key);
        }
        console.log($scope.selectedSubjectsIds);
        $localstorage.setObject('selectedSubjectsIds', $scope.selectedSubjectsIds);

        transferList.setSelectedSubjects($scope.selectedSubjectsIds);


        $scope.studentProfile = { name:"", subjects: $scope.selectedSubjectsIds}

        var myPopup = $ionicPopup.show({
            template: '<input type="password" ng-model="data.wifi">',
            title: 'Задолжителна најава',
            template: 'Дали сакате да ги зачувате овие промени? <label class="item item-input"> <span class="input-label">Ime</span> <input type="text" ng-model="studentProfile.name"/> </label>',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if ($scope.studentProfile.name == "") {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            return "Save";
                        }
                    }
                }
            ]
        });


        myPopup.then(function(res) {
            if(res == "Save"){
                var studentsProfiles = [];
                if(JSON.stringify($localstorage.getObject('studentsProfiles'))!="{}"){
                    studentsProfiles = $localstorage.getObject('studentsProfiles');
                }
                console.log($scope.studentProfile.name);
                studentsProfiles.push($scope.studentProfile);
                $localstorage.setObject('studentsProfiles',studentsProfiles);
                console.log($localstorage.getObject('studentsProfiles'));

            }
            $state.transitionTo("tab.selectedSubjects", {}, {reload: true, inherit: false, notify: true});
        });

    };
});