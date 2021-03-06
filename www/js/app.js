angular.module('starter', ['ionic', 'ionic.utils', 'starter.controllers', 'starter.services', 'firebase', 'ngCordova'])
    .run(function ($ionicPlatform, $rootScope) {

        $rootScope.invoker = "";
        $rootScope.question = {};
        $rootScope.chatPage = "tab.chat";
        $rootScope.noUserPictreUrl = "http://icons.iconarchive.com/icons/icons8/ios7/256/Users-User-Male-2-icon.png";

        $rootScope.connected = false;
        $rootScope.$on('$cordovaNetwork:online', function() {
            $rootScope.connected = true;
        });
        $rootScope.$on('$cordovaNetwork:offline', function() {
            $rootScope.connected = false;
        });

        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }


        });
    })
    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

		$ionicConfigProvider.tabs.style('standard');
		$ionicConfigProvider.backButton.text('Назад').icon('ion-chevron-left');
		$ionicConfigProvider.tabs.position('bottom');
		$ionicConfigProvider.navBar.alignTitle("center");

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

            .state('tab.schoolPrograms', {
                url: '/dash/schoolPrograms',
                cache: false,
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash-school-programs.html',
                        controller: 'SchoolProgramsCtrl'
                    }
                }
            })
            .state('tab.typesOfEducations', {
                url: '/dash/typesOfEducations',
                cache: false,
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash-types-of-educations.html',
                        controller: 'TypesOfEducationsCtrl'
                    }
                }
            })
            .state('tab.yearsOfStudy', {
                url: '/dash/yearsOfStudy',
                cache: false,
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash-years-of-study.html',
                        controller: 'YearsOfStudyCtrl'
                    }
                }
            })
            .state('tab.educationPlans', {
                url: '/dash/educationPlans',
                cache: false,
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash-education-plans.html',
                        controller: 'EducationPlansCtrl'
                    }
                }
            })
            .state('tab.subjects', {
                url: '/dash/subjects',
                cache: false,
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash-subjects.html',
                        controller: 'SubjectsCtrl'
                    }
                }
            })
            .state('tab.selectedSubjects', {
                url: '/dash/selectedSubjects',
                cache: false,
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash-selected-subjects.html',
                        controller: 'SelectedSubjectsCtrl'
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
                cache: false,
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
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
            })
            .state('tab.login', {
                url: '/account/login',
                cache: false,
                views: {
                    'tab-account': {
                        templateUrl: 'templates/login.html',
                        controller: 'LoginCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/dash/schoolPrograms');
    });