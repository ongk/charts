describe('pie chart directive', function() {

  var scope, element;

  beforeEach(module('hz.widgets.charts'));

  beforeEach(inject(function($compile, $rootScope) {
      scope = $rootScope;

      scope.testData = {
        title: 'Total Instances',
        data: [
          { label: 'Current', slice: 1 },
          { label: 'Applied', slice: 1 },
          { label: 'Available', slice: 6, showKey: false }
        ],
        colors: [ '#1f83c6', '#81c1e7', '#d1d3d4' ]
      };

      element = angular.element('<pie-chart chart-data="testData" chart-inner-radius="25"></pie-chart>');
      $compile(element)(scope);

      scope.$digest();
  }));

  it('should exist', function() {
    expect(element).toBeDefined();
  });

  it('should have svg element', function() {
    expect(element[0].firstChild.tagName).toBe('svg');
  });

  it('should have 3 path elements', function() {
    expect(element[0].querySelectorAll('path.slice').length).toBe(3);
  });

  it('should have correct path HTML', function() {
    var arcs = element[0].querySelector('g.slices');
    var arcsHtml = '<path style="fill: rgb(31, 131, 198);" title="Current: 1" class="slice" ' +
      'd="M2.1431318985078682e-15,-35A35,35 0 0,1 24.748737341529164,-24.74873734152916' +
      'L17.67766952966369,-17.677669529663685A25,25 0 0,0 1.5308084989341915e-15,-25Z"></path>' +
      '<path style="fill: rgb(129, 193, 231);" title="Applied: 1" class="slice" ' +
      'd="M24.748737341529164,-24.74873734152916A35,35 0 0,1 35,0L25,0A25,25 0 0,0 ' +
      '17.67766952966369,-17.677669529663685Z"></path><path style="fill: rgb(209, 211, 212);" ' +
      'title="Available: 6" class="slice" d="M35,0A35,35 0 1,1 -6.429395695523604e-15,-35' +
      'L-4.592425496802574e-15,-25A25,25 0 1,0 25,0Z"></path>';

    expect(arcs.innerHTML).toBe(arcsHtml);
  });

  it('should have a legend', function() {
    expect(element[0].querySelector('g.legend')).toBeDefined();
  });

  it('should have a correct legend title "Total Instances"', function() {
    expect(element[0].querySelector('g.legend').firstChild.innerHTML).toBe(scope.testData.title);
  });

  it ('should have correct legend key HTML', function() {
    var keyLabels = element[0].querySelector('g.legend').children[1];
    var keyLabelsHtml = '<g transform="translate(0,0)" class="slice-key">' +
      '<rect fill="#1f83c6" width="3" height="12"></rect>' +
      '<text fill="#444444" font-size="12px" dy="0.35em" y="6" x="8">1/8 Current</text></g>' +
      '<g transform="translate(0,16)" class="slice-key">' +
      '<rect fill="#81c1e7" width="3" height="12"></rect>' +
      '<text fill="#444444" font-size="12px" dy="0.35em" y="6" x="8">1/8 Applied</text></g>';

    expect(keyLabels.innerHTML).toBe(keyLabelsHtml);
  });

});