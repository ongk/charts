(function () {
  'use strict';

  function DashboardCtrl($scope) {

    $scope.data = [
      { label: "used", portion: 1 },
      { label: "needed", portion: 1 },
      { label: "unused", portion: 6 }
    ];

    $scope.colors = [ "#0000ff", "#00ff00", "#999" ];
  }

  angular.module('hz.app.dashboard')
         .controller('DashboardCtrl', [
            '$scope',
            DashboardCtrl
          ]);

})();