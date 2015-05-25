angular.module('starter.services', ['ionic.utils'])
/**
 * A simple example service that returns some data.
 */
.factory('fireBaseData', function($firebase) {
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
    }
  }
})


    .factory('Chats', function($localstorage,$firebase, fireBaseData) {
      // Might use a resource here that returns a JSON array


      console.log("Dojde vo chats");
      console.log($localstorage.get("language"));



      // Some fake testing data
      /*var chats = [{
        id: 0,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
      }, {
        id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
      },{
        id: 2,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
      }, {
        id: 3,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
      }, {
        id: 4,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
      }];*/

      return {
        all: function() {
            var reference = fireBaseData.refSchoolPrograms();
            reference.on("value", function(snapshot) {

            var schoolPrograms;
            var typesOfEducation;
            var yearsOfStudy;
            var educationPlans;
            var subjects;
            var chats = [];

            schoolPrograms = snapshot.val();

            for(var i=0;i<schoolPrograms.length;i++){
              console.log("Prv for");
              if(schoolPrograms[i]["language"] == $localstorage.get("language")){
                typesOfEducation = schoolPrograms[i]["types-of-education"];
              }
            }

              console.log(schoolPrograms);
              console.log(typesOfEducation);
              console.log(yearsOfStudy);
              console.log(educationPlans);
              console.log(subjects);
              console.log(chats);

            for(var i=0;i<typesOfEducation.length;i++) {
              console.log("Prv for");
              if (typesOfEducation[i]["name"] == $localstorage.get("typeOfEducation")) {
                yearsOfStudy = typesOfEducation[i]["years-of-study"];
              }
            }


              console.log(schoolPrograms);
              console.log(typesOfEducation);
              console.log(yearsOfStudy);
              console.log(educationPlans);
              console.log(subjects);
              console.log(chats);
            for(var i=0;i<yearsOfStudy.length;i++) {
              console.log("Prv for");
              if (yearsOfStudy[i]["name"] == $localstorage.get('yearOfStudy')) {
                educationPlans = yearsOfStudy[i]["education-plans"];
              }
            }


              console.log(schoolPrograms);
              console.log(typesOfEducation);
              console.log(yearsOfStudy);
              console.log(educationPlans);
              console.log(subjects);
              console.log(chats);
            for(var i=0;i<educationPlans.length;i++) {
              console.log("Prv for");
              if (educationPlans[i]["name"] == $localstorage.get('educationPlan')) {
                subjects = educationPlans[i]["subjects"];
              }
            }


              console.log(schoolPrograms);
              console.log(typesOfEducation);
              console.log(yearsOfStudy);
              console.log(educationPlans);
              console.log(subjects);
              console.log(chats);
            for(var i=0;i<subjects.length;i++){
              console.log("Prv for");
              var questions = subjects[i]["questions"];
              for(var j=0;j<questions.length;j++){
                console.log("Vtor for");
                console.log(questions[j]["chatroom"]);
                var users = questions[j]["chatroom"]["users"];
                console.log(users);
                for(var k=0;k<users.length;k++){
                  console.log(users[k]);
                  console.log($localstorage.getObject('user')["uid"]);
                  console.log(typeof users[k]);
                  console.log(typeof $localstorage.getObject('user')["uid"]);
                  if(users[k] == $localstorage.getObject('user')["uid"]){
                    chats.push(questions[j]["chatroom"]);
                    console.log("Isti se");
                  }
                }

              }
            }

              console.log(schoolPrograms);
              console.log(typesOfEducation);
              console.log(yearsOfStudy);
              console.log(educationPlans);
              console.log(subjects);
              console.log(chats);
            return chats;

          }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
          });
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
    });

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

