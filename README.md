charts
======

D3 donut chart as AngularJS directive

HTML Usage:<br/>
&lt;donut-chart chart-data="data" chart-text="25%"&gt;&lt;/donut-chart&gt;

Controller Usage:<br/>
$scope.data = [
    { label: 'Current', portion: 1 },
    { label: 'Applied', portion: 1 },
    { label: 'Available', portion: 6 }
  ];

$scope.colors = [ '#0000ff', '#00ff00', '#999' ];

<hr>

Required attributes:<br/>
- chart-data - attribute name of data defined in $scope
- chart-text -  text to display in donut hole 

Optional attributes:<br/>
- chart-colors - attribute name of colors defined in $scope
- chart-diameter - diameter of donut chart
- chart-thickness - thickness of donut
- attributes of &lt;text&gt; element such as fill, font-size, font-family, etc...


