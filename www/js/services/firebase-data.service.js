angular.module('starter.services').factory('fireBaseData', function($firebaseArray) {
  var appRef = new Firebase("https://uchizaeksterno.firebaseio.com/");
  var schoolProgramsRef = new Firebase("https://uchizaeksterno.firebaseio.com/school-programs");
  var typesOfEducationRef = new Firebase("https://uchizaeksterno.firebaseio.com/types-of-education");
  var usersRef = new Firebase("https://uchizaeksterno.firebaseio.com/users");
  var yearsOfStudyRef = new Firebase("https://uchizaeksterno.firebaseio.com/years-of-study");
  var subjectsRef = new Firebase("https://uchizaeksterno.firebaseio.com/subjects");
  var questionsRef = new Firebase("https://uchizaeksterno.firebaseio.com/questions");
  var educationPlansRef = new Firebase("https://uchizaeksterno.firebaseio.com/education-plans");
  var ref = new Firebase("https://blistering-torch-6297.firebaseio.com/");
  var refMaApp = new Firebase("https://blistering-torch-6297.firebaseio.com/ma-app");
  var refSchoolPrograms = new Firebase("https://blistering-torch-6297.firebaseio.com/ma-app/school-programs");

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
      //return $firebase(schoolProgramsRef).$asArray();
      return $firebaseArray(schoolProgramsRef);
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
      return $firebaseArray(typesOfEducationRef);
    }
    ,
    typesOfEducationReference: function(){
      return typesOfEducationRef;
    }
    ,
    yearsOfStudyRef: function(){
      return $firebaseArray(yearsOfStudyRef);
    },
    subjectsRef:function(){
      return $firebaseArray(subjectsRef);
    },
    questionsRef: function(){
      return questionsRef;
      //return $firebase(questionsRef).$asArray();
    },
    educationPlansRef: function(){
      return $firebaseArray(educationPlansRef);
    },
    getSchoolPrograms: function(){
      var scoolPrograms = $firebaseArray(schoolProgramsRef);
      scoolPrograms.$loaded(function(list){
        return list;
      });
    }
  }
});