/* global TrelloPowerUp */
/* global angular */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var saveInputResultSelector = document.getElementById("saveInputResult");
var vegetableSelector = document.getElementById("vegetable");
var GLOBAL = {};

t.render(function() {
  // return Promise.all([
  //   t.get("card", "shared", "userInput"),
  //   t.get("card", "shared", "zillowInfo")
  // ])
  //   .spread(function(userInput, zillowInfo) {
  //     console.log(userInput, zillowInfo);
  //     // GLOBAL.userInput = userInput;
  //     // GLOBAL.zillowInfo = zillowInfo;
  //   })
  //   .then(function() {
    return  t.sizeTo("#content");
    // });
});

//Bluebird promises (what Trello uses) playing nice with Angular
//https://stackoverflow.com/questions/23984471/how-do-i-use-bluebird-with-angular
//
function trackDigests(app) {
  app.run([
    "$rootScope",
    function($rootScope) {
      Promise.setScheduler(function(cb) {
        $rootScope.$evalAsync(cb);
      });
    }
  ]);
}
(function() {
  var app = angular.module("myapp", []);
  app.controller("appController", [
    "$scope",
    "$rootScope",
    "$http",
    function($scope, $rootScope, $http) {
      Promise.setScheduler(function(cb) {
        $rootScope.$evalAsync(cb);
      });
      $scope.messages = {};
      t.sizeTo("#content");
      $scope.allowOverflow = function() {
        document
          .getElementById("content")
          .setAttribute("style", "overflow-x:visible");
      };
      $scope.allowOverflow();
      $scope.hasWriteAccess = function(){
        return t.memberCanWriteToModel('card');
      }
      t.get("card", "shared", "userInput").then(function(userInput) {
        //console.log("got data ", userInput);
        $scope.userInput = userInput;
        $scope.allowOverflow();
        //$scope.$apply();
      });

      t.get("card", "shared", "zillowInfo").then(function(zillowInfo) {
        $scope.zillowInfo = zillowInfo;
        $scope.allowOverflow();
      });
      // $scope.$watch(function(){ return GLOBAL; }, function(newValue,oldValue){
      //   console.log("loading card setting", GLOBAL);
      //   angular.copy(GLOBAL.userInput,$scope.userInput);
      //   angular.copy(GLOBAL.zillowInfo,$scope.zillowInfo);
      // });

      $scope.saveAndLookup = function() {
        $scope.messages = {};

        t.set("card", "shared", "userInput", $scope.userInput).then(function() {
          console.log("saved successfully");
          $scope.messages.saveInputResult = "Input Saved!";
          $scope.allowOverflow();
        });
        //SENDING REQUEST TWICE??
        //user supplied an address
        if ($scope.userInput.zillowLookupType === "address") {
          
          $scope.messages.zillowResult = "Searching Zillow";
          $http({
            url: "https://zillow-trello-powerup.glitch.me/zillow/address",
            method: "GET",
            params: $scope.userInput
          })
            .then(function(data, status, headers, config) {
              $scope.zillowInfo = data.data;
              console.log(data);
              t.set("card", "shared", "zillowInfo", $scope.zillowInfo);
              delete $scope.messages.zillowResult;
            })
            .catch(function(data, status, headers, config) {
              $scope.messages.zillowResult = "Error getting data " + status;
            });
        } else if ($scope.userInput.zillowLookupType === "zpid") {
          //
        }
      };
    }
  ]);
})();
