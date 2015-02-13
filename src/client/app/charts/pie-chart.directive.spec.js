/* jshint globalstrict: true */
'use strict';

describe('hz.widget.charts module', function () {
  it('should be defined', function () {
    expect(angular.module('hz.widget.charts')).toBeDefined();
  });
});

describe('pie chart directive', function() {

  var $scope, $element;

  beforeEach(module('hz.widget.charts'));

  beforeEach(inject(function($injector) {
    var $compile = $injector.get('$compile');
    $scope = $injector.get('$rootScope').$new();

    $scope.testData = {
      title: 'Total Instances',
      data: [
        { label: 'Current', slice: 1 },
        { label: 'Added', slice: 1 },
        { label: 'Remaining', slice: 6, showKey: false }
      ],
      colors: [ '#1f83c6', '#81c1e7', '#d1d3d4' ]
    };

    var settings = '{ "innerRadius": 25 }';
    var markup = "<pie-chart chart-data='testData' chart-settings='" + settings + "'></pie-chart>";
    $element = angular.element(markup);
    $compile($element)($scope);

    $scope.$digest();
  }));

  it('should be compiled', function() {
    expect($element.html().trim()).not.toBe('');
  });

  it('should have svg element', function() {
    expect($element.find('svg')).toBeDefined();
  });

  it('should have 3 path elements', function() {
    expect($element.find('path.slice').length).toBe(3);
  });

  it('should have correct colors for slices', function() {
    var slices = $element.find('path.slice');

    var slice1Color = slices[0].style.fill;

    if (slice1Color.indexOf('rgb') === 0) {
      expect(slices[0].style.fill).toBe('rgb(31, 131, 198)');
      expect(slices[1].style.fill).toBe('rgb(129, 193, 231)');
      expect(slices[2].style.fill).toBe('rgb(209, 211, 212)');
    } else {
      expect(slices[0].style.fill).toBe('#1f83c6');
      expect(slices[1].style.fill).toBe('#81c1e7');
      expect(slices[2].style.fill).toBe('#d1d3d4');
    }
  });

  it('should have a correct title "Total Instances (8 Max)"', function() {
    var title = $element.find('g.chart-title > text').text();
    expect(title).toBe('Total Instances (8 Max)');
  });

  it('should have a legend', function() {
    expect($element.find('g.legend')).toBeDefined();
  });

  it ('should have correct legend keys and labels', function() {
    var legendKeys = $element.find('g.legend g.slice-key');

    var firstKeyLabel = legendKeys[0];
    var secondKeyLabel = legendKeys[1];

    expect(firstKeyLabel.querySelector('rect').getAttribute('fill')).toBe('#1f83c6');
    expect(firstKeyLabel.querySelector('text').textContent).toBe('1 Current');

    expect(secondKeyLabel.querySelector('rect').getAttribute('fill')).toBe('#81c1e7');
    expect(secondKeyLabel.querySelector('text').textContent).toBe('1 Added');
  });

});