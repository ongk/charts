(function() {
	'use strict';

  angular.module('hz.app.charts', []).directive('donutChart', function() {

    var link = function($scope, $element, $attr) {
      var data = $scope[$attr.data];
      var colors = $attr.colors ? $scope[$attr.colors] : [ "#0000ff", "#00ff00", "#999" ];

      var diameter = $attr.diameter;
      var radius = diameter / 2;
      var thickness = $attr.thickness;
      var colorScale = d3.scale.ordinal().range(colors);

      var arc = d3.svg.arc()
                      .outerRadius(radius)
                      .innerRadius(radius - thickness);

      var pie = d3.layout.pie()
                         .sort(null)
                         .value(function(d) { return d.portion; });

      var svg = d3.select($element[0])
                  .append("svg")
                  .attr("width", diameter)
                  .attr("height", diameter)
                  .append("g")
                  .attr("transform", "translate(" + radius + "," + radius + ")");

      var g = svg.selectAll(".arc")
                 .data(pie(data))
                 .enter()
                 .append("g")
                 .attr("class", "arc");

      g.append("path")
       .attr("d", arc)
       .style("fill", function(d) { return colorScale(d.data.label); })
       .attr("title", function(d) { return d.data.label + ": " + d.data.portion; });

      var text = $attr.isUnicode === "true" ? String.fromCharCode(parseInt($attr.text, 16)) : $attr.text;
      if (text) {
        var fontFamily = $attr.fontFamily ? $attr.fontFamily : "Open Sans,sans-serif";
        var fontVariant = $attr.fontVariant ? $attr.fontVariant : "normal";
        var fontWeight = $attr.fontWeight ? $attr.fontWeight : "normal";
        var fontStyle = $attr.fontStyle ? $attr.fontStyle : "normal";
        var fontSize = $attr.fontSize ? $attr.fontSize : "1em";
        var fontColor = $attr.fontColor ? $attr.fontColor : "#333333";
        g.append("text")
         .text(text)
         .attr("dy", "0.38em")
         .attr("font-family", fontFamily)
         .attr("font-variant", fontVariant)
         .attr("font-weight", fontWeight)
         .attr("font-style", fontStyle)
         .attr("font-size", fontSize)
         .attr("fill", fontColor)
         .attr("text-anchor", "middle");
      }
    };

    return {
      replace: true,
      link: link,
      restrict: 'E'
    }
  });

})();