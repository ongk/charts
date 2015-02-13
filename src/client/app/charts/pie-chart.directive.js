/* jshint globalstrict: true */
(function() {
  'use strict';

  /**
   * @ngdoc overview
   * @name  hz.widget.charts
   * @description
   *
   * # hz.widget.charts
   *
   * The `hz.widget.charts` module provides directives for simple charts
   * used in Horizon, such as the pie and donut chart. Charts are
   * implemented using D3.
   *
   * Requires {@link http://d3js.org `D3`} to be installed.
   *
   * | Constants                                                             |
   * |-----------------------------------------------------------------------|
   * | {@link hz.widget.charts.constant:pieChartsettings `pieChartSettings`} |
   *
   * | Directives                                             |
   * |--------------------------------------------------------|
   * | {@link hz.widget.charts.directive:pieChart `pieChart`} |
   *
   */
  angular.module('hz.widget.charts', [])

    /**
     * @ngdoc parameters
     * @name hz.widget.charts.constant:pieChartsettings
     * @param {number} innerRadius The inner radius in pixels, default: 0
     * @param {number} outerRadius The outer radius in pixels, default: 35
     * @param {function} colorScale The color scale to use for slices
     * @param {string} title.font-size The title font size in pixels, default: 13px
     * @param {number} title.font-weight The title font weight, default: 600
     * @param {boolean} title.show Show title, default: true
     * @param {string} label.fill The chart label color, default: #333333
     * @param {string} label.font-family The chart label font family
     * @param {string} label.font-size The chart label font size in pixels, default: 16px
     * @param {string} legend.fill The legend key label color, default: #444444
     * @param {string} legend.font-size The legend font size in pixels, default: 12px
     * @param {boolean} legend.show Show legend, default: true
     */
    .constant('pieChartSettings', {
      innerRadius: 0,
      outerRadius: 35,
      colorScale: d3.scale.category20(),
      title: {
        'font-size': '13px',
        'font-weight': 600,
        'show': true
      },
      label: {
        'fill': '#333333',
        'font-family': 'Open Sans,sans-serif',
        'font-size': '16px'
      },
      legend: {
        'fill': '#444444',
        'font-size': '12px',
        'show': true
      }
    })

    /**
     * @ngdoc directive
     * @name hz.widget.charts.directive:pieChart
     * @element
     * @param {object} chart-data The chart data model
     * @param {string} chart-settings The custom chart settings (JSON), optional
     * @description
     * The `pieChart` directive renders a pie or donut chart using D3. A legend
     * is also shown by default.
     *
     * Data Model:
     * ```
     * var chartData = {
     *    title: 'Total Instances',
     *    data: [
     *      { label: 'Current', slice: 1 },
     *      { label: 'Added', slice: 1 },
     *      { label: 'Remaining', slice: 6, showKey: false }
     *    ],
     *    text: '25%',
     *    colors: [ '#1f83c6', '#81c1e7', '#d1d3d4' ]
     * };
     *
     * title - the chart title
     * data - the data used to render chart
     * text - the text to show in donut hole
     * colors - the set of colors to use for pie slices
     * ```
     *
     * @restrict E
     * @scope true
     *
     * @example
     * ```
     * Pie Chart:
     * <pie-chart chart-data='chartData'></pie-chart>
     *
     * Donut Chart:
     * <pie-chart chart-data='chartData' chart-settings='{ "innerRadius": 25 }'></pie-chart>
     * ```
     *
     */
    .directive('pieChart', [ 'pieChartSettings', function(pieChartSettings) {

      function link(scope, element, attrs) {
        var options = $.extend(true, {}, pieChartSettings, angular.fromJson(attrs.chartSettings));
        var diameter = options.outerRadius * 2;
        var titleFontSize = options.title.show ? parseInt(options.title['font-size']) : 0;
        var titleOffset = titleFontSize + 10;

        var arc = d3.svg.arc()
                          .outerRadius(options.outerRadius)
                          .innerRadius(options.innerRadius);

        var pie = d3.layout.pie()
                    .sort(null)
                    .value(function(d) { return d.slice; });

        var body = d3.select('body');

        var elt = d3.select(element[0]);

        var previousTooltip = body.select('div.chart-tooltip');
        var tooltip = previousTooltip.empty() ?
                      body.append('div').attr('class', 'chart-tooltip') :
                      previousTooltip;

        var svg = elt.append('svg')
                      .attr('width', diameter)
                      .attr('height', diameter + titleOffset);

        var chartTitle = svg.append('g')
                        .attr('class', 'chart-title');

        var slicesOffsetY = options.outerRadius + titleOffset;
        var slices = svg.append('g')
                          .attr('class', 'slices')
                          .attr('transform', 'translate(' + options.outerRadius + ',' + slicesOffsetY + ')');

        var legendOffsetX = diameter + 12;
        var legendOffsetY = titleOffset ? titleOffset + 10 : 0;
        var legend = svg.append('g')
                          .attr('class', 'legend')
                          .attr('transform', 'translate(' + legendOffsetX + ',' + legendOffsetY + ')');

        var unwatch = scope.$watch(attrs.chartData, updateChart);
        scope.$on('$destroy', unwatch);

        function updateChart(data) {
          var sliceData = data.data;
          var sliceSum = d3.sum(sliceData, function(d) { return d.slice; });
          var colorScale = data.colors ? d3.scale.ordinal().range(data.colors) : options.colorScale;

          chartTitle.select('text').remove();
          if (options.title.show) {
            createLegendTitle(data.title + ' (' + sliceSum + ' Max)');
          }

          createSlices(sliceData, colorScale);

          // Clear old chart label and re-draw
          elt.select('.chart-label').remove();
          if (data.hasOwnProperty('text')) {
            createLabel(data.text);
          }

          // Clear old legend key and re-draw
          legend.selectAll('*').remove();
          if (options.legend.show) {
            var keyFilterFunc = function(d) {
              return !d.hasOwnProperty('showKey') || d.showKey;
            };

            var filteredKeys = sliceData.filter(keyFilterFunc);
            if (filteredKeys.length) {
              createLegendKeys(filteredKeys, sliceSum, colorScale);
            }
          }

          if (options.title.show || options.legend.show) {
            try {
              updateChartSize();
            } catch(error) {
              /* for Jasmine tests */
            }
          }
        }

        var animate = function animate(d) {
          this.lastAngle = this.lastAngle || { startAngle: 0, endAngle: 0 };
          var interpolate = d3.interpolate(this.lastAngle, d);
          this.lastAngle = interpolate(0);

          return function(t) {
            return arc(interpolate(t));
          };
        };

        var showTooltip = function showTooltip(elt, d, colorScale) {
          var tooltipFontSize = parseInt(options.legend['font-size']);

          var evt = d3.event;
          var x = evt.pageX - 20;
          var y = evt.pageY - (tooltipFontSize * 2) - 10;

          var keyColor = colorScale(d.data.label);
          var content = '<i class="fa fa-square"></i> <span class="tooltip-key">' +
                        d.data.label + '</span> ' + d.data.slice;
          tooltip.html(content);

          tooltip.style({
            top: y + 'px',
            left: x + 'px',
            'font-size': tooltipFontSize + 'px',
            display: 'inline-block'
          });

          tooltip.select('i.fa').style({ color: keyColor });

          evt.stopPropagation();
        };

        var clearTooltip = function() {
          tooltip.style({ display: 'none' });
        };

        d3.select('body').on('click', clearTooltip);

        function createSlices(data, colorScale) {
          var chart = slices.selectAll('path.slice')
                              .data(pie(data));

          chart.enter()
                  .append('path')
                    .attr('d', arc)
                    .attr('class', 'slice');

          chart.attr('title', function(d) { return d.data.label + ': ' + d.data.slice; })
            .style('fill', function(d, i) { return colorScale(i); })
            .on('click', function(d) { showTooltip(this, d, colorScale); });

          chart.transition()
                  .duration(500)
                  .attrTween('d', animate);

          chart.exit().remove();
        }

        function createLabel(text) {
          var textAttributes = {
            'dy': '0.35em',
            'text-anchor': 'middle'
          };
          angular.extend(textAttributes, options.label);

          slices.append('g')
                  .attr('class', 'chart-label')
                  .append('text')
                    .text(text)
                    .attr(textAttributes);
        }

        function createLegendTitle(title) {
          var titleAttributes = {
            'x': 0,
            'y': options.title['font-size'],
            'text-anchor': 'start',
          };
          angular.extend(titleAttributes, options.title);

          chartTitle.append('text')
                      .text(title)
                      .attr(titleAttributes);
        }

        function createLegendKeys(legendKeys, sliceSum, colorScale) {
          var keys = legend.append('g')
                              .attr('transform', 'translate(5,0)')
                              .selectAll('g.slice-key')
                                .data(legendKeys);

          // Prevent overlapping of key labels
          var keyVSpacing = parseInt(options.legend['font-size']) + 4;
          var keyLabels = keys.enter()
                                .append('g')
                                  .attr('class', 'slice-key')
                                  .attr('transform', function(d, i) {
                                    return 'translate(0,' + (i * keyVSpacing) + ')';
                                  });

          var keyFontSize = parseInt(options.legend['font-size']);
          keyLabels.append('rect')
                      .attr('height', keyFontSize)
                      .attr('width', '0.5em')
                      .attr('fill', function(d) { return colorScale(d.label); });

          var keyLabelAttributes = {
            'x': '1em',
            'y': keyFontSize / 2,
            'dy': '0.35em'
          };
          angular.extend(keyLabelAttributes, options.legend);

          keyLabels.append('text')
                      .text(function(d) { return d.slice + ' ' + d.label; })
                      .attr(keyLabelAttributes);
        }

        // Update the chart size after rendering title and legend
        function updateChartSize() {
          var chartTitleBBox = chartTitle.node().getBBox();
          var chartTitleWidth = chartTitleBBox.width;

          var legendBBox = legend.node().getBBox();
          var legendHeight = legendBBox.height + legendBBox.y;
          var legendWidth = legendBBox.width + legendBBox.x + diameter + 12;

          if (legendHeight > diameter) {
            svg.attr('height', legendHeight);
          }

          var widest = Math.max(chartTitleWidth, legendWidth);
          if (widest > diameter) {
            svg.attr('width', widest);
          }
        }
      }

      return {
        restrict: 'E',
        scope: true,
        link: link
      };

    }]);

})();