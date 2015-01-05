(function () {
  'use strict';

  function DashboardCtrl($scope) {

    $scope.data = [
      { label: 'Current', portion: 1 },
      { label: 'Applied', portion: 1 },
      { label: 'Available', portion: 6 }
    ];

    $scope.colors = [ '#0000ff', '#00ff00', '#999' ];
  }

  angular.module('hz.app.dashboard')
         .controller('DashboardCtrl', [
            '$scope',
            DashboardCtrl
          ]);

})();