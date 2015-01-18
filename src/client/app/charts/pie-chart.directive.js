(function() {
  'use strict';

  angular
    .module('hz.widgets.charts', [])
    .directive('pieChart', pieChart);

  function pieChart() {

    var directive = {
      restrict: 'E',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      var innerRadius = attrs.chartInnerRadius ? parseInt(attrs.chartInnerRadius) : 0;
      var outerRadius = attrs.chartOuterRadius ? parseInt(attrs.chartOuterRadius) : 35;
      var diameter = outerRadius * 2;

      var showLegend = attrs.chartShowLegend ? attrs.chartShowLegend : 'true';
      var titleFontSize = attrs.chartTitleFontSize ? parseInt(attrs.chartTitleFontSize) : 13;
      var keyFontSize = attrs.chartKeyFontSize ? parseInt(attrs.chartKeyFontSize) : 12;
      var legendOffset = diameter + 12;

      var arc = d3.svg.arc()
                        .outerRadius(outerRadius)
                        .innerRadius(innerRadius);

      var pie = d3.layout.pie()
                  .sort(null)
                  .value(function(d) { return d.slice; });

      var svg = d3.select(element[0])
                  .append('svg')
                    .attr('width', diameter)
                    .attr('height', diameter);

      var slices = svg.append('g')
                        .attr('class', 'slices')
                        .attr('transform', 'translate(' + outerRadius + ',' + outerRadius + ')');

      var legend = svg.append('g')
                        .attr('class', 'legend')
                        .attr('transform', 'translate(' + legendOffset + ',0)');

      var unwatch = scope.$watch(attrs.chartData, updateChart);
      scope.$on('$destroy', unwatch);

      function updateChart(data) {
        var sliceData = data.data;
        var colorScale = data.colors ? d3.scale.ordinal().range(data.colors) : d3.scale.category20();

        createSlices(sliceData, colorScale);

        /* Chart label */
        d3.select(element[0])
            .select('.chart-label')
            .remove();

        var text = data.unicodeText ? String.fromCharCode(parseInt(data.unicodeText, 16)) : data.text;
        if (text) {
          createLabel(text);
        }

        /* Chart legend */
        legend.selectAll('*').remove();

        if (showLegend === 'true') {
          if (data.title) {
            createLegendTitle(data.title);
          }

          var filteredKeys = sliceData.filter(function(d) { return !d.hasOwnProperty('showKey') || d.showKey; });
          if (filteredKeys.length) {
            var sliceSum = d3.sum(sliceData, function(d) { return d.slice; });
            createLegendKeys(filteredKeys, sliceSum, colorScale);
          }

          updateChartSize();
        }
      }

      function animate(d) {
        var self = this;
        self.lastAngle = self.lastAngle || { startAngle: 0, endAngle: 0 };
        var interpolate = d3.interpolate(self.lastAngle, d);
        self.lastAngle = interpolate(0);

        return function(t) {
          return arc(interpolate(t));
        };
      }

      function createSlices(data, colorScale) {
        var chart = slices.selectAll('path.slice')
                            .data(pie(data));

        chart.enter()
                .append('path')
                  .attr('d', arc)
                  .attr('class', 'slice');

        chart.attr('title', function(d) { return d.data.label + ': ' + d.data.slice; })
          .style('fill', function(d, i) { return colorScale(i); });

        chart.transition()
          .duration(500)
          .attrTween('d', animate);

        chart.exit().remove();
      }

      function createLabel(text) {
        var textAttributes = {
          'dy': '0.35em',
          'text-anchor': 'middle',
          'font-family': 'Open Sans,sans-serif',
          'font-size': '1.2em',
          'fill': '#333333'
        };

        /* Custom font attributes */
        angular.forEach(attrs.$attr, function(value, camelCaseKey) {
          if (camelCaseKey.lastIndexOf('chart', 0) !== 0) {
            textAttributes[value] = attrs[camelCaseKey];
          }
        });

        slices.append('g')
              .attr('class', 'chart-label')
              .append('text')
                .text(text)
                .attr(textAttributes);
      }

      function createLegendTitle(title) {
        var titleAttributes = {
          'x': 0,
          'y': titleFontSize + 2,
          'text-anchor': 'start',
          'font-size': titleFontSize + 'px',
          'font-weight': 600
        };

        legend.append('text')
                .text(title)
                .attr(titleAttributes);
      }

      function createLegendKeys(legendKeys, sliceSum, colorScale) {
        var keys = legend.append('g')
                            .attr('transform', 'translate(5,' + (titleFontSize + 12) + ')')
                            .selectAll('g.slice-key')
                              .data(legendKeys);

        var keyVSpacing = keyFontSize + 4;
        var keyLabels = keys.enter()
                              .append('g')
                                .attr('class', 'slice-key')
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

      function updateChartSize() {
        try {
          var legendBBox = legend.node().getBBox();
          var legendHeight = legendBBox.height + legendBBox.y;
          var legendWidth = legendBBox.width + legendBBox.x + diameter + 12;

          if (legendHeight > diameter) {
            svg.attr('height', legendHeight);
          }

          if (legendWidth > diameter) {
            svg.attr('width', legendWidth);
          }
        } catch (err) {
          /* do nothing */
        }
      }
    }
  }

})();