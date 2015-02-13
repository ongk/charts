(function () {
  'use strict';

  angular
    .module('hz.dashboard', [])
    .controller('DashboardCtrl', [ '$scope', DashboardCtrl ]);

  function DashboardCtrl($scope) {

    $scope.instances = {
      title: 'Total Instances',
      data: [
        { label: 'Current', slice: 1 },
        { label: 'Added', slice: 1 },
        { label: 'Remaining', slice: 6 }
      ],
      colors: [ '#1f83c6', '#81c1e7', '#d1d3d4' ]
    };

    $scope.vcpus = {
      title: 'Total VCPUs',
      data: [
        { label: 'Current', slice: 1 },
        { label: 'Added', slice: 1 },
        { label: 'Remaining', slice: 6 }
      ],
      colors: [ '#1f83c6', '#81c1e7', '#d1d3d4' ],
      text: '30%'
    };

    $scope.ram = {
      data: [
        { label: 'Current', slice: 2048 },
        { label: 'Added', slice: 1024 },
        { label: 'Remaining', slice: 10240 }
      ],
      colors: [ '#1f83c6', '#81c1e7', '#d1d3d4' ],
      text: '\uf1b2'
    };

    $scope.settings = {
      innerRadius: 25,
      legend: {
        show: false
      }
    };

    $scope.vcpuSettings = {
      innerRadius: 55,
      outerRadius:75,
      label: {
        'font-size': '2.5em'
      },
      title: {
        'font-size': '16px'
      },
      legend: {
        'font-size': '14px'
      }
    };

    $scope.ramSettings = {
      innerRadius: 55,
      outerRadius: 75,
      title: {
        show: false
      },
      label: {
        fill: '#1f83c6',
        'font-family': 'FontAwesome',
        'font-size': '3.5em'
      }
    };

    $scope.randomizeChart = function() {

      $scope.instances = {
        title: 'Total Instances',
        data: [
          { label: 'Current', slice: Math.floor(Math.random() * 10) + 2 },
          { label: 'Applied', slice: Math.floor(Math.random() * 10) + 2 },
          { label: 'Available', slice: Math.floor(Math.random() * 10) + 2, showKey: false }
        ],
        colors: [ '#1f83c6', '#74c476', '#81c1e7' ]
      };

      $scope.vcpus = {
        title: 'Total VCPUs',
        data: [
          { label: 'Current', slice: Math.floor(Math.random() * 10240) + 1024 },
          { label: 'Applied', slice: Math.floor(Math.random() * 10240) + 1024 },
          { label: 'Available', slice: Math.floor(Math.random() * 10240) + 1024 }
        ],
        colors: [ '#1f83c6', '#81c1e7', '#d1d3d4' ],
        text: (Math.floor(Math.random() * 90) + 5) + '%'
      };
    };
  }

})();