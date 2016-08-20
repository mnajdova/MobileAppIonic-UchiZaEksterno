angular.module('starter.services').service('fileUpload', ['$http', function ($http) {
  this.uploadFileToUrl = function(file, uploadUrl){
    var fd = new FormData();
    fd.append('file', file);
    $http.post(uploadUrl, fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    })
      .success(function(msg){
        alert(msg);
      })
      .error(function(err){
        alert(err);
      });
  }
}]);