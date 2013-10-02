/*
 * Test annotations within the Directive Definition Object (DDO):
 *
 *    angular.module('myMod', []).directive('whatever', function () {
 *      return {
 *        controller: function ($scope) { ... }  // <--- this needs annotations
 *      };
 *    })
 *
 */

var assert = require('should');

// so we don't have to put the stuff we're testing into a string
var stringifyFunctionBody = require('./util').stringifyFunctionBody;
var annotate = function (arg) {
  return require('../main').annotate(
    stringifyFunctionBody(arg));
};


describe('annotate', function () {

  it('should annotate $stateProvider.state() resolve', function () {
    var annotated = annotate(function () {
      angular.module('myMod', []).
        config(function ($stateProvider) {
          $stateProvider.state('path/:id', {
            resolve: {
              data: function($stateParams) {
                var id = $stateParams.id; 
              }
            }
          });
        });
    });

    annotated.should.equal(stringifyFunctionBody(function () {
      angular.module('myMod', []).
        config(['$stateProvider', function ($stateProvider) {
          $stateProvider.state('path/:id', {
            resolve: {
              data: ['$statePrams', function($stateParams) {
                var id = $stateParams.id; 
              }]
            }
          });
        }]);
    }));
  });
});
