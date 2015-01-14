(function() {
	'use strict';

  angular.module('hz.app.charts', []).directive('donutChart', function() {

    function link(scope, element, attrs) {
      var diameter = attrs.chartDiameter ? parseInt(attrs.chartDiameter) : 70;
      var radius = diameter / 2;
      var thickness = attrs.chartThickness ? parseInt(attrs.chartThickness) : 10;

      var showKey = attrs.chartShowKey ? attrs.chartShowKey : 'true';
      var titleFontSize = attrs.titleFontSize ? parseInt(attrs.titleFontSize) : 13;
      var keyFontSize = attrs.keyFontSize ? parseInt(attrs.keyFontSize) : 12;

      var arc = d3.svg.arc()
                      .outerRadius(radius)
                      .innerRadius(radius - thickness);

      var pie = d3.layout.pie()
                         .sort(null)
                         .value(function(d) { return d.slice; });

      var svg = d3.select(element[0])
                  .append('svg')
                  .attr('width', diameter + 200)
                  .attr('height', diameter);

      var arcs = svg.append('g')
                    .attr('class', 'arcs')
                    .attr('transform', 'translate(' + radius + ',' + radius + ')');

      var legend = svg.append('g')
                      .attr('class', 'legend')
                      .attr('transform', 'translate(' + (diameter + 12) + ',0)');

      function animate(d) {
        this.lastAngle = this.lastAngle || { startAngle: 0, endAngle: 0 };
        var interpolate = d3.interpolate(this.lastAngle, d);
        this.lastAngle = interpolate(0);

        return function(t) {
          return arc(interpolate(t));
        };
      }

      function updateChart(data) {
        var sliceData = data.data;
        var colorScale = data.colors ? d3.scale.ordinal().range(data.colors) : d3.scale.category20();

        var donut = arcs.selectAll('path.arc')
                        .data(pie(sliceData));

        donut.enter()
             .append('path')
             .attr('d', arc)
             .attr('class', 'arc');

        donut.attr('title', function(d) { return d.data.label + ': ' + d.data.slice; })
             .style('fill', function(d, i) { return colorScale(i); });

        donut.transition()
             .duration(500)
             .attrTween('d', animate);

        donut.exit().remove();

        // Update/set the donut hole text if text attribute is specified for slice
        d3.select(element[0]).select('.chart-label').remove();
        var text = data.unicodeText ? String.fromCharCode(parseInt(data.unicodeText, 16)) : data.text;
        if (text) {
          var textAttributes = {
            'dy': '0.35em',
            'text-anchor': 'middle',
            'font-family': 'Open Sans,sans-serif',
            'font-size': '1.2em',
            'fill': '#333333'
          };

          // Custom font attributes
          angular.forEach(attrs['$attr'], function(value, camelCaseKey) {
            if (camelCaseKey.lastIndexOf('chart', 0) !== 0) {
              textAttributes[value] = attrs[camelCaseKey];
            }
          });

          arcs.append('g')
             .attr('class', 'chart-label')
             .append('text')
             .text(text)
             .attr(textAttributes);
        }

        // Update/set the chart key
        if (showKey === 'true') {
          legend.selectAll('*').remove();

          if (data.title) {
            var titleAttributes = {
              'x': 0,
              'y': titleFontSize + 2,
              'text-anchor': 'start',
              'font-size': titleFontSize + 'px',
              'font-weight': 600
            };

            legend.append('text')
                  .text(data.title)
                  .attr(titleAttributes);
          }

          var sliceSum = d3.sum(sliceData, function(d) { return d.slice; });
          var filteredKeys = sliceData.filter(function(d) { return !d.hasOwnProperty('showKey') || d.showKey; });

          if (filteredKeys.length) {
            var keys = legend.append('g')
                             .attr('transform', 'translate(5,' + (titleFontSize + 12) + ')')
                             .selectAll('g.arc-key')
                             .data(filteredKeys);

            var keyVSpacing = keyFontSize + 4;
            var keyLabels = keys.enter()
                                .append('g')
                                .attr('class', 'arc-key')
                                .attr('transform', function(d, i) { return 'translate(0,' + (i * keyVSpacing) + ')'; });

            keyLabels.append('rect')
                     .attr('height', keyFontSize)
                     .attr('width', 3)
                     .attr('fill', function(d) { return colorScale(d.label); });

            var keyLabelAttributes = {
              'x': 8,
              'y': keyFontSize / 2,
              'dy': '0.35em',
              'font-size': keyFontSize + 'px',
              'fill': '#444444'
            };
            keyLabels.append('text')
                     .text(function(d) { return d.slice + '/' + sliceSum + ' ' + d.label; })
                     .attr(keyLabelAttributes);
          }
        }
      }

      var unwatch = scope.$watch(attrs.chartData, updateChart);
      scope.$on('$destroy', unwatch);
    }

    return {
      restrict: 'E',
      link: link
    }

  });

})();