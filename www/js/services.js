angular.module('starter.services', ['ionic.utils'])
/**
 * A simple example service that returns some data.
 */
.factory('fireBaseData', function($firebase) {
      var appRef = new Firebase("https://uchizaeksterno.firebaseio.com/");
      var schoolProgramsRef = new Firebase("https://uchizaeksterno.firebaseio.com/school-programs");
      var typesOfEducationRef = new Firebase("https://uchizaeksterno.firebaseio.com/types-of-education");
      var usersRef = new Firebase("https://uchizaeksterno.firebaseio.com/users");
      var yearsOfStudyRef = new Firebase("https://uchizaeksterno.firebaseio.com/years-of-study");
      var subjectsRef = new Firebase("https://uchizaeksterno.firebaseio.com/subjects");
      var questionsRef = new Firebase("https://uchizaeksterno.firebaseio.com/questions");
      var educationPlansRef = new Firebase("https://uchizaeksterno.firebaseio.com/education-plans");

  var ref = new Firebase("https://blistering-torch-6297.firebaseio.com/"),
      refMaApp = new Firebase("https://blistering-torch-6297.firebaseio.com/ma-app"),
      refSchoolPrograms = new Firebase("https://blistering-torch-6297.firebaseio.com/ma-app/school-programs");

  return {
    ref: function () {
      return ref;
    },
    refExpenses: function () {
      return refExpenses;
    },
    refRoomMates: function () {
      return refRoomMates;
    },
    refSchoolPrograms: function () {
      return refSchoolPrograms;
    },
    schoolProgramsRef: function () {
      return $firebase(schoolProgramsRef).$asArray();
    },
    schoolProgramsReference: function () {
      return schoolProgramsRef;
    },
    appRef: function(){
      return appRef;
    }
    ,
    usersRef: function(){
      return usersRef;
    }
    ,
    typesOfEducationRef: function(){
      return $firebase(typesOfEducationRef).$asArray();
    }
    ,
    typesOfEducationReference: function(){
      return typesOfEducationRef;
    }
    ,
    yearsOfStudyRef: function(){
      return $firebase(yearsOfStudyRef).$asArray();
    },
    subjectsRef:function(){
      return $firebase(subjectsRef).$asArray();
    },
    questionsRef: function(){
      return questionsRef;
      //return $firebase(questionsRef).$asArray();
    },
    educationPlansRef: function(){
      return $firebase(educationPlansRef).$asArray();
    },
    getSchoolPrograms: function(){
      var scoolPrograms = $firebase(schoolProgramsRef).$asArray();
      scoolPrograms.$loaded(function(list){
        return list;
      });
    }
  }
})
    .service('transferList', function(){
      var typesOfEducations = [];
      var educationPlans = [];
      var yearsOfStudy = [];
      var subjects = [];
      var selectedSubjects = [];
      return{
        getTypesOfEducations: function(){
          return typesOfEducations;
        },
        setTypesOfEducations: function(l){
          typesOfEducations = l;
        },
        getEducationPlans: function(){
          return educationPlans;
        },
        setEducationPlans: function(l){
          educationPlans = l;
        },
        getYearsOfStudy: function(){
          return yearsOfStudy;
        },
        setYearsOfStudy: function(l){
          yearsOfStudy = l;
        },
        getSubjects: function(){
          return subjects;
        },
        setSubjects: function(l){
          subjects = l;
        },
        getSelectedSubjects: function(){
          return selectedSubjects;
        },
        setSelectedSubjects: function(l){
          selectedSubjects = l;
        }
      }
    })
    .service('fileUpload', ['$http', function ($http) {
      this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
        })
            .success(function(msg){
              console.log("Message from service");
              console.log(msg);
              alert(msg);
              console.log("End message from service");
            })
            .error(function(err){
              console.log(err);
              alert(err);
            });
      }
    }]);




angular.module('ionic.utils', [])
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);

