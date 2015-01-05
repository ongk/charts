(function() {
	'use strict';

  angular.module('hz.app.charts', []).directive('donutChart', function() {

    var link = function(scope, element, attrs) {
      var data = scope[attrs.chartData];
      var colors = attrs.chartColors ? scope[attrs.chartColors] : [ '#1f83c6', '#81c1e7', '#d1d3d4' ];

      var diameter = attrs.chartDiameter ? attrs.chartDiameter : 70;
      var radius = diameter / 2;
      var thickness = attrs.chartThickness ? attrs.chartThickness : 10;
      var colorScale = d3.scale.ordinal().range(colors);

      var arc = d3.svg.arc()
                      .outerRadius(radius)
                      .innerRadius(radius - thickness);

      var pie = d3.layout.pie()
                         .sort(null)
                         .value(function(d) { return d.portion; });

      var svg = d3.select(element[0])
                  .append('svg')
                  .attr('width', diameter)
                  .attr('height', diameter)
                  .append('g')
                  .attr('transform', 'translate(' + radius + ',' + radius + ')');

      var g = svg.selectAll('.arc')
                 .data(pie(data))
                 .enter()
                 .append('g')
                 .attr('class', 'arc');

      g.append('path')
       .attr('d', arc)
       .style('fill', function(d) { return colorScale(d.data.label); })
       .attr('title', function(d) { return d.data.label + ': ' + d.data.portion; });

      var text = attrs.chartIsUnicode === 'true' ? String.fromCharCode(parseInt(attrs.chartText, 16)) : attrs.chartText;
      if (text) {
        var textAttributes = {
          'dy': '0.38em',
          'text-anchor': 'middle',
          'font-family': 'Open Sans,sans-serif',
          'font-size': '1em',
          'fill': '#333333'
        };

        angular.forEach(attrs['$attr'], function(value, camelCaseKey) {
          if (camelCaseKey.lastIndexOf('chart', 0) !== 0) {
            textAttributes[value] = attrs[camelCaseKey];
          }
        });

        svg.append('g')
           .append('text')
           .text(text)
           .attr(textAttributes);
      }
    };

    return {
      replace: true,
      link: link,
      restrict: 'E'
    }
  });

})();