angular.module('starter.services').service('transferList', function(){
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
});