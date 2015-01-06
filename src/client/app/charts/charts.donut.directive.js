(function() {
	'use strict';

  angular.module('hz.app.charts', []).directive('donutChart', function() {

    var link = function(scope, element, attrs) {
      var diameter = attrs.chartDiameter ? attrs.chartDiameter : 70;
      var radius = diameter / 2;
      var thickness = attrs.chartThickness ? attrs.chartThickness : 10;

      var arc = d3.svg.arc()
                      .outerRadius(radius)
                      .innerRadius(radius - thickness);

      var pie = d3.layout.pie()
                         .sort(null)
                         .value(function(d) { return d.slice; });

      var svg = d3.select(element[0])
                  .append('svg')
                  .attr('width', diameter)
                  .attr('height', diameter)
                  .append('g')
                  .attr('transform', 'translate(' + radius + ',' + radius + ')');

      scope.$watch('chartData', function(data) {
        var colorScale = data.colors ? d3.scale.ordinal().range(data.colors) : d3.scale.category20();

        d3.select(element[0]).selectAll('.arc').remove();
        var donut = svg.selectAll('.arc')
                       .data(pie(data.data))
                       .enter()
                       .append('g')
                       .attr('class', 'arc');

        donut.append('path')
             .attr('d', arc)
             .style('fill', function(d) { return colorScale(d.data.label); })
             .attr('title', function(d) { return d.data.label + ': ' + d.data.slice; });

        d3.select(element[0]).select('.label').remove();
        var text = data.unicodeText ? String.fromCharCode(parseInt(data.unicodeText, 16)) : data.text;
        if (text) {
          var textAttributes = {
            'dy': '0.38em',
            'text-anchor': 'middle',
            'font-family': 'Open Sans,sans-serif',
            'font-size': '1.2em',
            'fill': '#333333'
          };

          angular.forEach(attrs['$attr'], function(value, camelCaseKey) {
            if (camelCaseKey.lastIndexOf('chart', 0) !== 0) {
              textAttributes[value] = attrs[camelCaseKey];
            }
          });

          svg.append('g')
             .attr('class', 'label')
             .append('text')
             .text(text)
             .attr(textAttributes);
        }
      });
    };

    return {
      restrict: 'E',
      scope: {
        chartData: "="
      },
      link: link
    }

  });

})();