export default class ChartOption {
  constructor () {
    _.assign(this, {
      chart: {
        animation: false,
        zoomType: null,
        pinchType: null,
        panning: false,
        width: 1,
        height: 1,
        alignTicks: false
      },
      rangeSelector: {enabled: false},
      navigator: {enabled: false},
      scrollbar: {enabled: false},
      legend: {enabled: false},
      credits: {enabled: false},
      exporting: {enabled: false},
      yAxis: {
        opposite: false
      }
    });
  }
}
