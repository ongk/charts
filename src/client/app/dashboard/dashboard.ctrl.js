(function () {
  'use strict';

  function DashboardCtrl($scope) {

    $scope.instances = {
      data: [
        { label: 'Current', slice: 1 },
        { label: 'Applied', slice: 1 },
        { label: 'Available', slice: 6 }
      ],
      colors: [ '#1f83c6', '#81c1e7', '#d1d3d4' ]
    };

    $scope.vcpus = {
      data: [
        { label: 'Current', slice: 1 },
        { label: 'Applied', slice: 1 },
        { label: 'Available', slice: 6 }
      ],
      colors: [ '#1f83c6', '#81c1e7', '#d1d3d4' ],
      text: "30%"
    };

    $scope.ram = {
      data: [
        { label: 'Current', slice: 2048 },
        { label: 'Applied', slice: 1024 },
        { label: 'Available', slice: 10240 }
      ],
      colors: [ '#1f83c6', '#81c1e7', '#d1d3d4' ],
      unicodeText: "f1b2"
    };

    $scope.updateChart = function() {
      $scope.instances = {
        data: [
          { label: 'Current', slice: 1 },
          { label: 'Applied', slice: 7 }
        ],
        colors: [ '#1f83c6', '#74c476' ],
        text: "100%"
      };

      $scope.ram = {
        data: [
          { label: 'Current', slice: 2048 },
          { label: 'Applied', slice: 2048 },
          { label: 'Available', slice: 10240 }
        ],
        colors: [ '#1f83c6', '#81c1e7', '#d1d3d4' ],
        unicodeText: "f1b2"
      };
    };
  }

  angular.module('hz.app.dashboard').controller('DashboardCtrl', [ '$scope', DashboardCtrl ]);

})();