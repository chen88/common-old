export default class Csv {
  constructor () {}
  jsonToCsv (objArray) {
    let array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '', line = '';

    let head = array[0];
    for (let index in array[0]) {
      line += index + ', ';
    }

    line = line.replace(/[, ]$/, '').slice(0, -1);
    str += line + '\r\n';

    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in array[i]) {
        line += array[i][index] + ', ';
      }

      line = line.replace(/[, ]$/, '').slice(0, -1);
      str += line + '\r\n';
    }
    return str;
  }
  requestCsv (fileName, requestPromise) {
    let that = this;
    return requestPromise.then(function (res) {
      if(!res.data) {
        //no data
        return;
      }
      that.downloadCsv(res.data, res.config, fileName);
    });
  }
  // downloadCsv (data, config, fileName) {
  //   if(typeof(data) === 'object') {
  //     data = this.jsonToCsv(data);
  //   }

  //   config = config || {
  //     url: 'data:text/csv;charset=utf-8,' + escape(data)
  //   };

  //   let octetStreamMime = 'application/octet-stream';
  //   fileName = fileName.replace(/.csv$/, '') + '.csv';
  //   // Determine the content type from the header or default to 'application/octet-stream'
  //   let contentType = octetStreamMime;

  //   // Support for saveBlob method (Currently only implemented in Internet Explorer as msSaveBlob, other extension incase of future adoption)
  //   let saveBlob = navigator.msSaveBlob || navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
  //   let urlEncodedParams = config.params ? '?' + $.param(config.params) : '';
  //   try {
  //     if(saveBlob)
  //     {
  //         // Save blob is supported, so get the blob as it's contentType and call save.
  //         let blob = new Blob([data], { type: contentType });
  //         saveBlob(blob, fileName);
  //     }
  //     else
  //     {
  //       // Get the blob url creator
  //       let urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
  //       if(urlCreator)
  //       {
  //           // Try to use a download link
  //           let link = document.createElement('a');
  //           if('download' in link)
  //           {
  //               // Prepare a blob URL
  //               let blob = new Blob([data], { type: contentType });
  //               let url = urlCreator.createObjectURL(blob);
  //               link.setAttribute('href', url);

  //               // Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
  //               link.setAttribute('download', fileName);

  //               // Simulate clicking the download link
  //               let event = document.createEvent('MouseEvents');
  //               event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
  //               link.dispatchEvent(event);
  //           } else {
  //               window.open(config.url + urlEncodedParams, '_self');
  //           }

  //       } else {
  //           window.open(config.url + urlEncodedParams, '_self');
  //       }
  //     }
  //   } catch (e) {
  //     window.open(config.url + urlEncodedParams, '_self');
  //   }
  // }
  downloadCsv (data, config, fileName) {
    if(typeof(data) === 'object') {
      data = this.jsonToCsv(data);
    }

    let charset = 'utf-8';
    let blob = new Blob([data], {
      type: 'text/csv;charset='+ charset + ';'
    });

    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      let downloadContainer = angular.element('<div data-tap-disabled="true"><a></a></div>');
      let downloadLink = angular.element(downloadContainer.children()[0]);
      downloadLink.attr('href', window.URL.createObjectURL(blob));
      downloadLink.attr('download', fileName);
      downloadLink.attr('target', '_blank');
      $(document).find('body').append(downloadContainer);
      a.$timeout(function () {
        downloadLink[0].click();
        downloadLink.remove();
      }, null);
    }
  }

  downloadExcel (data, fileName) {
    let charset = 'utf-8';
    let blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      let downloadContainer = angular.element('<div data-tap-disabled="true"><a></a></div>');
      let downloadLink = angular.element(downloadContainer.children()[0]);
      downloadLink.attr('href', window.URL.createObjectURL(blob));
      downloadLink.attr('download', fileName);
      downloadLink.attr('target', '_blank');
      $(document).find('body').append(downloadContainer);
      a.$timeout(function () {
        downloadLink[0].click();
        downloadLink.remove();
      }, null);
    }
  }
  downloadPlainText (data, fileName) {
    let blob = new Blob([data]);
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      let downloadContainer = angular.element('<div data-tap-disabled="true"><a></a></div>');
      let downloadLink = angular.element(downloadContainer.children()[0]);
      downloadLink.attr('href', window.URL.createObjectURL(blob));
      downloadLink.attr('download', fileName);
      downloadLink.attr('target', '_blank');
      $(document).find('body').append(downloadContainer);
      a.$timeout(function () {
        downloadLink[0].click();
        downloadLink.remove();
      }, null);
    }
  }
}
