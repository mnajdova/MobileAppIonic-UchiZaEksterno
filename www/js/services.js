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
    yearsOfStudyRef: function(){
      return $firebase(yearsOfStudyRef).$asArray();
    },
    subjectsRef:function(){
      return $firebase(subjectsRef).$asArray();
    },
    questionsRef: function(){
      return $firebase(questionsRef).$asArray();
    },
    educationPlansRef: function(){
      return $firebase(educationPlansRef).$asArray();
    }
  }
});

  /*  .factory('Chats', function($localstorage,$firebase, fireBaseData, $q) {
      // Might use a resource here that returns a JSON array


      console.log("Dojde vo chats");
      console.log($localstorage.get("language"));


      return {
        all: function() {

          var deferred = $q.defer();
          var chats = [];
          var isFinished=false;

          var interval = setInterval(function() {
            var reference = fireBaseData.refSchoolPrograms();
            reference.on("value", function(snapshot) {

              var schoolPrograms;
              var typesOfEducation;
              var yearsOfStudy;
              var educationPlans;
              var subjects;

              schoolPrograms = snapshot.val();

              for(var i=0;i<schoolPrograms.length;i++){
                if(schoolPrograms[i]["language"] == $localstorage.get("language")){
                  $localstorage.set("languageIndex", i);
                  typesOfEducation = schoolPrograms[i]["types-of-education"];
                }
              }

              for(var i=0;i<typesOfEducation.length;i++) {
                if (typesOfEducation[i]["name"] == $localstorage.get("typeOfEducation")) {
                  $localstorage.set("typeOfEducationIndex", i);
                  yearsOfStudy = typesOfEducation[i]["years-of-study"];
                }
              }

              for(var i=0;i<yearsOfStudy.length;i++) {
                if (yearsOfStudy[i]["name"] == $localstorage.get('yearOfStudy')) {
                  $localstorage.set("yearOfStudyIndex", i);
                  educationPlans = yearsOfStudy[i]["education-plans"];
                }
              }

              for(var i=0;i<educationPlans.length;i++) {
                if (educationPlans[i]["name"] == $localstorage.get('educationPlan')) {
                  $localstorage.set("educationPlanIndex", i);
                  subjects = educationPlans[i]["subjects"];
                }
              }

              for(var i=0;i<subjects.length;i++){
                var questions = subjects[i]["questions"];
                for(var j=0;j<questions.length;j++){
                  console.log(questions[j]["chatroom"]);
                  var users = questions[j]["chatroom"]["users"];
                  for(var k=0;k<users.length;k++){
                    if(users[k] == $localstorage.getObject('user')["uid"]){
                      chats.push(questions[j]["chatroom"]);
                    }
                  }

                }
              }

              clearInterval(interval);
              console.log("Clearing...");
              deferred.resolve(chats);

            }, function (errorObject) {
              deferred.reject("The read failed: " + errorObject.code);
            });

          }, 1000);
          return deferred.promise;
        },
        remove: function(chat) {
          chats.splice(chats.indexOf(chat), 1);
        },
        get: function(chatId) {
          for (var i = 0; i < chats.length; i++) {
            if (chats[i].id === parseInt(chatId)) {
              return chats[i];
            }
          }
          return null;
        }
      };
    });*/

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

