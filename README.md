charts
======

D3 donut chart as AngularJS directive

<p>This directive generates a simple donut chart using D3. Any changes to chart-data will fire an update to the chart.</p>

<h5>HTML Usage</h5>
<pre>&lt;div ng-app="hz.app" ng-controller="DashboardCtrl"&gt;</pre>
<pre>  &lt;donut-chart chart-data="data" chart-text="25%"&gt;&lt;/donut-chart&gt;</pre>
<pre>&lt;/div&gt;</pre>

<h5>Controller Usage</h5>
<pre>
angular.module('app').controller('MyCtrl', [ '$scope', function($scope) {
  $scope.instances = {
    data: [
      { label: 'Current', slice: 1 },
        { label: 'Applied', slice: 1 },
        { label: 'Available', slice: 6 }
      ],
    colors: [ '#1f83c6', '#81c1e7', '#d1d3d4' ],
    text: "25%"
  };

  // Change the data (optional)
  $scope.updateChart = function() {
    $scope.instances = {
      data: [
        { label: 'Current', slice: 1 },
        { label: 'Applied', slice: 7 }
      ],
      colors: [ '#1f83c6', '#ff0000' ],
      text: "100%"
    };
  };
}]);
</pre>

<hr>

Attributes:<br/>
- chart-data (required) - attribute name of data defined in $scope
- chart-diameter - diameter of donut chart
- chart-thickness - thickness of donut
- any attributes for &lt;text&gt; element such as font-size, font-family, fill, etc...


