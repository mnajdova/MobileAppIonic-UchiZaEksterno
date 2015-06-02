var app = angular.module('starter', ['ionic', 'ionic.utils', 'starter.controllers', 'starter.services', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })

    .state('tab.chats', {
      url: '/chats',
      cache: false,
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
      .state('tab.chat-detail', {
        url: '/chats/:chatId',
        views: {
          'tab-chats': {
            templateUrl: 'templates/chat-detail.html',
            controller: 'ChatDetailCtrl'
          }
        }
      })
      .state('tab.questions', {
        url: '/dash/:subjectId',
        views: {
          'tab-dash': {
            templateUrl: 'templates/questions.html',
            controller: 'QuestionsCtrl'
          }
        }
      })
    .state('tab.account', {
      url: '/account',
      cache:false,
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }

    })
      .state('tab.login', {
        url: '/account/login',
        cache : false,
        views: {
          'tab-account': {
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
          }
        }
      })
      .state('tab.register', {
        url: '/account/register',
        cache: false,
        views: {
          'tab-account': {
            templateUrl: 'templates/register.html',
            controller: 'RegisterCtrl'
          }
        }
      });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');
});