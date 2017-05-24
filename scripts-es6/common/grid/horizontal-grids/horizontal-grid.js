let delay = tkgConst.timeout.singleGrid;
let minimumGridWidth = tkgConst.size.minimumGridSize;
let bindEvent = tkgConst.bindEvent;

export function horizontalGrid () {
  return {
    restrict: 'E',
    templateUrl: 'common/grid/horizontal-grids/horizontal-grid.html',
    controller: hGridCtrl,
    controllerAs: 'hGridCtrl',
    link: ($scope, element, attrs, hGridCtrl) => {
      element.addClass('horizontal-grid-container');
      hGridCtrl.setContainer(element);
    }
  }
}

class hGridCtrl {
  constructor ($scope, $attrs, tkgConfig, prepareWindowEvents) {
    this.$scope = $scope;
    this.templates = tkgConfig.getHGridListObj()[$attrs.from];
    this.disableResizer = $attrs.disableResizer === 'true';
    this.container; //horizontal-grid
    this.parent; //.single-grid-child
    // this.panel; //.panel
    this.children = [];
    this.fixedChildren = [];
    this.freeChildren = [];
    this.sizedChildren = [];
    this.resizableChildren = [];
    this.lastSizableChild;
    this.totalChild = 0;
    this.ready = false;

    $scope.$watch(
      () => {return this.templates},
      () => {this.initializeWidth();},
      true);
    $scope.$on('manualResized', (e, reInit) => {
      if(reInit !== false) {
        this.initializeWidth();
      }
    });
    prepareWindowEvents($scope, () => {
      this.windowResize();
    });
  }
  setContainer (container) {
    this.container = container;
    this.parent = container.parent();
    // this.panel = container.closest('.panel');
  }
  addChild (element) {
    this.totalChild ++;
    let currentTmpl = this.templates[this.totalChild - 1];
    let child = {
      element: element,
      tmpl: currentTmpl
    };
    this.children.push(child);
    if(currentTmpl.isFixed) {
      this.fixedChildren.push(child);
    } else if(currentTmpl.width !== undefined) {
      this.sizedChildren.push(child);
    } else {
      this.freeChildren.push(child);
    }
    return child;
  }
  getContainerWidth () {
    return this.parent.width();
  }
  initialize () {
    this.lastSizableChild = _.findLast(this.children, (child) => {return !child.tmpl.isFixed});
    this.lastSizableChild.lastSizable = true;
    this.resizableChildren = this.freeChildren.concat(this.sizedChildren);
    this.initializeWidth();
  }
  adjustPadding () {
    _.forEach(this.children, (child, i) => {
      if(child.tmpl.width === 0) {
        child.element.prev().addClass('padding-none');
      } else {
        child.element.prev().removeClass('padding-none');
      }
    });
  }
  initializeWidth (extraDelay) {
    if(!this.ready) {
      return;
    }
    clearTimeout(this.initWidthTimer);
    this.initWidthTimer = setTimeout(() => {
      let containerWidth = this.getContainerWidth();
      let remainingWidth = containerWidth;
      let fixedChildren = this.fixedChildren.concat(this.sizedChildren);

      _.forEach(fixedChildren, (child, i) => {
        let childWidth = child.tmpl.width;
        child.element.css({width: childWidth + 'px'});
        remainingWidth -= childWidth;

        if(!childWidth) {
          child.element.addClass('panel-border-none');
        } else {
          child.element.removeClass('panel-border-none');
        }
      });

      let panelWidth = remainingWidth / this.freeChildren.length;
      _.forEach(this.freeChildren, (child, i) => {
        child.element
          .css({width: panelWidth + 'px'});
      });
      this.adjustPadding();

      this.$scope.$broadcast('manualResized', false);
    }, delay + extraDelay);

  }
  getTotalChildWidth () {
    let width = 0;
    _.forEach(this.children, (child) => {
      width += child.element.outerWidth();
    });
    return width;
  }
  // diff between window and sum of all children width
  getWidthDiff () {
    return this.getContainerWidth() - this.getTotalChildWidth();
  }
  windowResize (extraDelay) {
    if(!this.ready) {
      return;
    }
    clearTimeout(this.windowResizeTimer);
    this.windowResizeTimer = setTimeout(() => {
      let widthDiff = this.getWidthDiff();
      let resizableChildren = _.filter(this.resizableChildren, (child, i) => {
        return child.tmpl.width !== 0;
      });
      let additionalLength = Math.floor(widthDiff / resizableChildren.length);
      _.forEach(resizableChildren, (child) => {
        let ele = child.element;
        let newWidth = ele.outerWidth() + additionalLength;
        ele.css({
          width: newWidth + 'px'
        });
      });
      this.adjustPadding();
    }, delay + extraDelay);
  }
}

export function hGridChildren () {
  return {
    restrict: 'A',
    require: '^horizontalGrid',
    link: ($scope, element, attrs, hGridCtrl) => {
      $scope.currentHGridChild = hGridCtrl.addChild(element);

      if($scope.$last) {
        hGridCtrl.ready = true;
        hGridCtrl.initialize();
      }
    }
  }
}

export function gridHorizontalResizer () {
  return {
    restrict: 'E',
    template: '<div class="resize-bar vertical"></div>',
    scope: true,
    priority: 0,
    require: '^horizontalGrid',
    link: ($scope, element, attrs, hGridCtrl) => {
      let prevChild = hGridCtrl.children[$scope.$index - 1];
      let currentChild = $scope.currentHGridChild;
      let prevElement = prevChild.element;
      let currentElement = currentChild.element;

      let bar = element.children();
      let body = $('body');
      let moved = false;
      let initialPosition;
      let finalPosition;
      let lastPosition;
      let currentElementWidth;
      let prevElementWidth;
      let tempCurrentElementWidth;

      function mousedown (evt) {
        /** ignore middle and right buttons click **/
        if( evt.which === 2 || evt.which === 3 ) {
          return;
        }
        initialPosition = bar.position().left;
        currentElementWidth = currentElement.width();
        prevElementWidth = prevElement.width();

        moved = true;
        bar.addClass('moving');
        body.addClass('resizing');
        body.on('mousemove', mousemove);
        body.on('mouseup', mouseup);
      }

      function mousemove (evt) {
        if( !lastPosition ) {
          lastPosition = evt.clientX;
          return;
        }
        moveBar(evt);
        lastPosition = evt.clientX;
      }

      function moveBar (evt) {
        let distance = evt.clientX - lastPosition;
        let currentPosition = bar.position().left;
        let newPosition = currentPosition + distance;
        let movedDistance = newPosition - initialPosition;
        let toRight = movedDistance >= 0;
        if((toRight && currentElementWidth - movedDistance >= minimumGridWidth) ||
          (!toRight && prevElementWidth + movedDistance >= minimumGridWidth)) {
          bar.css({left: newPosition});
        }
      }

      function mouseup (evt) {
        finalPosition = bar.position().left;
        adjustWidth();
        moved = false;
        lastPosition = undefined;
        bar.removeClass('moving');
        body.removeClass('resizing');
        body.off('mousemove', mousemove);
        body.off('mouseup', mouseup);
        bar.css({left: 0});
      }

      function adjustWidth () {
        let movedDistance = finalPosition - initialPosition;
        currentElement.width(currentElementWidth - movedDistance);
        prevElement.width(prevElementWidth + movedDistance);
        hGridCtrl.$scope.$broadcast('manualResized', false);
      }

      bindEvent(element, 'mousedown', mousedown, $scope);

    }
  }
}
