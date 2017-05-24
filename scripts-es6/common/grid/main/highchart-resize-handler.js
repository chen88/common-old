export function highchartResizeHandler ($timeout) {
  return {
    restrict: 'A',
    scope: true,
    priority: 0,
    link: function ($scope, element, attrs) {
      var chart
      var parentElement;
      var isCurrentElement;
      var subtractHeight;
      var subtractWidth;
      var maxHeight;
      var maxWidth;
      var widthOnly = attrs.widthOnly;
      var delay = tkgConst.timeout.highchart;
      var counter;

      function initializeVariables () {
        chart = $scope.$eval(attrs.chartConfig)
        parentElement = element.parents(attrs.parentElement)
        isCurrentElement = attrs.currentElement
        subtractHeight = attrs.subtract
        subtractWidth = attrs.subtractWidth
        maxHeight = attrs.maxHeight
        maxWidth = attrs.maxWidth
      }

      if($scope.$eval(attrs.chartConfig)) {
        initializeVariables();
        init();
      } else {
        var poll = window.setInterval(function () {
          initializeVariables();
          if(chart) {
            window.clearInterval(poll);
            init();
          }
        }, delay);
      }

      function init () {

        if(isCurrentElement === 'true') {
          parentElement = element;
        }
        if(chart.hasOwnProperty('options')) {
          chart = [chart];
        }
        /** Initializing the size of the highchart **/
        function setChartSize () {
          $timeout.cancel(counter);
          counter = $timeout(function () {
            var widthSubtraction = subtractWidth ? (/%/.test(subtractWidth) ? parseFloat(subtractWidth)/100 * parentElement.width() : parseFloat(subtractWidth)) : 0
            var newHeight = parentElement.height() - subtractHeight
              , newWidth = parentElement.width() - 5 - widthSubtraction
              , newHeight = maxHeight ?
                            ( maxHeight.indexOf('%') > -1 ? newHeight * parseInt(maxHeight) / 100 :
                            parseInt(maxHeight) ) : newHeight
              , newWidth =  maxWidth ?
                            ( maxWidth.indexOf('%') > -1 ? newWidth * parseInt(maxWidth) / 100 :
                            parseInt(maxWidth) ) : newWidth
              ;

            if(newHeight < 0 || newWidth < 0) return;

            _.forEach(chart, function (currentChart) {
              currentChart.size = currentChart.size || {};
              currentChart.size.width = newWidth;
              currentChart.size.height = newHeight;
              if(currentChart.options.plotOptions && currentChart.options.plotOptions.column) {
                return;
              }
              var yAxis = currentChart.options.yAxis;
              if(yAxis) {
                if(_.isArray(yAxis)) {
                  _.forEach(yAxis, function (currentYAxis) {
                    currentYAxis.height = newHeight - 55;
                  });
                } else {
                  yAxis.height = newHeight - 55;
                }
              }
            });
          }, delay);
        }
        setChartSize();

        $scope.setChartSize = setChartSize;
        $scope.$on('manualResized', setChartSize);
        $scope.$on('panelMinimized', setChartSize);
        $scope.$on('minimized', function () {
          if(!$scope.isFromMaximized) {
            setChartSize();
          }
        });
      }
    }
  };
}