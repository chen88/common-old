// let resizeDelay = tkgConst.timeout.setPrimaryGrid;
let delay = tkgConst.timeout.singleGrid;
let childDelay = tkgConst.timeout.singleGridChild;
let minimumGridSize = tkgConst.size.minimumGridSize;
let defaultVeritcalGridHeight = tkgConst.size.singleGridHeight;
let borderBottomSize = tkgConst.size.singleGridBorder;
let bindEvent = tkgConst.bindEvent;
let collapsedHeight = tkgConst.size.panelHeading + 4;
let maximized = false;
let minimumGridHeight = collapsedHeight;

export function verticalGrid () {
  return {
    restrict: 'E',
    templateUrl: 'common/grid/vertical-grids/vertical-grid.html',
    controller: vGridCtrl,
    controllerAs: 'vGridCtrl',
    link: ($scope, element, attrs, vGridCtrl) => {
      vGridCtrl.setContainer(element.children());
    }
  };
}

class vGridCtrl {
  constructor ($scope, $attrs, tkgConfig, prepareWindowEvents) {
    this.$scope = $scope;
    this.templates = tkgConfig.getGridList();
    _.forEach(this.templates.collapsed, (template) => {
      template.collapsed = template.collapsed !== undefined ? template.collapsed : false;
    });
    this.container;
    this.children = [];
    this.lastChild = {tmpl: {}};
    this.totalChild = 0;
    this.ready = false;

    $scope.$watch(
      () => {return this.templates},
      () => {this.initialize();},
      true);
    prepareWindowEvents($scope, () => {
      this.initialize();
    });
  }
  setContainer (container) {
    this.container = container;
  }
  addChild (element) {
    this.totalChild ++;
    let currentTmpl = this.templates[this.totalChild - 1];
    let child = {
      element: element,
      tmpl: currentTmpl
    };
    this.children.push(child);
    return child;
  }
  initialize (extraDelay = 0) {
    if(!this.ready) {
      return;
    }
    clearTimeout(this.initHeightTimer);
    this.initHeightTimer = setTimeout(() => {
      let containerHeight = this.container.height();
      let remainingHeight = containerHeight;
      delete this.lastChild.tmpl.isLast;
      this.lastChild = _.findLast(this.children, (child) => {
        return child.tmpl.height !== 0 && !child.tmpl.collapsed;
      });
      this.lastChild.tmpl.isLast = true;

      _.forEach(this.children, (child, i) => {
        let childHeight = defaultVeritcalGridHeight;
        if(child.tmpl.collapsed) {
          if(child.tmpl.height === 0) {
            remainingHeight -= borderBottomSize + 1;
            childHeight = 0;
          } else {
            childHeight = collapsedHeight;
          }
        } else if(typeof(child.tmpl.height) === 'number') {
          childHeight = child.tmpl.height;
        }
        if(childHeight > 0) {
          child.element.css({
            height: childHeight
          });
          remainingHeight = remainingHeight - childHeight - borderBottomSize;
        }
      });

      if(remainingHeight > 0 && !maximized) {
        this.lastChild.element.css({
          height: this.lastChild.element.height() + remainingHeight - (this.children.length === 2 ? borderBottomSize : 0)
        });
      }
      this.$scope.$broadcast('manualResized');
    }, childDelay + extraDelay);
  }
}

export function vGridChildren () {
  return {
    restrict: 'A',
    require: '^verticalGrid',
    link: ($scope, element, attrs, vGridCtrl) => {
      $scope.currentVGridChild = vGridCtrl.addChild(element);

      if($scope.$last) {
        // vGridCtrl.lastChild = element;
        vGridCtrl.ready = true;
        vGridCtrl.initialize();
      }
    }
  }
}

export function vGridMinimizer () {
  return {
    restrict: 'E',
    template: `<i class="pull-right fa" ng-class="{'fa-plus': currentVGridChild.tmpl.collapsed, 'fa-minus': !currentVGridChild.tmpl.collapsed}" ></i>`,
    link: ($scope, element, attrs) => {
      let vGridCtrl = $scope.vGridCtrl;
      let currentTmpl = $scope.currentVGridChild.tmpl;

      function click (e) {
        e.stopPropagation();
        currentTmpl.collapsed = !currentTmpl.collapsed;
        if(attrs.isOpen) {
          _.set($scope, attrs.isOpen, !currentTmpl.collapsed);
        }
        vGridCtrl.initialize();
        vGridCtrl.$scope.$broadcast('manualResized');
      }

      bindEvent(element, 'click', click, $scope);
      $scope.$watch(attrs.isOpen, (collapsed) => {
        if(typeof(collapsed) !== 'boolean') {
          return;
        }
        currentTmpl.collapsed = !collapsed;
        setTimeout(() => {
          vGridCtrl.initialize();
          vGridCtrl.$scope.$broadcast('manualResized');
        });
      });

    }
  };
}

export function vGridMaximizer () {
  return {
    restrict: 'E',
    templateUrl: 'common/grid/vertical-grids/vertical-grid-maximizer.html',
    link: ($scope, element, attrs) => {
      $scope.usePlus = attrs.usePlus === 'true';
      let vGridCtrl = $scope.vGridCtrl;
      let currentTmpl = $scope.currentVGridChild.tmpl;
      bindEvent(element, 'click', () => {
        maximized = currentTmpl.maximized = !currentTmpl.maximized;
        if(!maximized) {
          vGridCtrl.initialize();
        }
        vGridCtrl.$scope.$broadcast('manualResized');
      }, $scope);
    }
  };
}

export function gridVerticalResizer () {
  return {
    restrict: 'E',
    template: '<div class="resize-bar horizontal"></div>',
    scope: true,
    priority: 0,
    require: '^verticalGrid',
    link: ($scope, element, attrs, vGridCtrl) => {
      let nextChild = vGridCtrl.children[$scope.$index + 1];
      let nextIsLast = $scope.$index + 1 === vGridCtrl.children.length - 1;
      let currentChild = $scope.currentVGridChild;
      let nextElement = nextChild.element;
      let currentElement = currentChild.element;

      let bar = element.children();
      let body = $('body');
      let moved = false;
      let initialPosition;
      let finalPosition;
      let lastPosition;
      let currentElementHeight;
      let nextElementHeight;
      let tempCurrentElementHeight;

      function mousedown (evt) {
        /** ignore middle and right buttons click **/
        if( evt.which === 2 || evt.which === 3 ) {
          return;
        }
        initialPosition = bar.position().top;
        currentElementHeight = currentElement.height();
        nextElementHeight = nextElement.height();

        moved = true;
        bar.addClass('moving');
        body.addClass('resizing');
        body.on('mousemove', mousemove);
        body.on('mouseup', mouseup);
      }

      function mousemove (evt) {
        if( !lastPosition ) {
          lastPosition = evt.clientY;
          return;
        }
        moveBar(evt);
        lastPosition = evt.clientY;
        tkgConst.preventSelection(evt);
      }

      function moveBar (evt) {
        let distance = evt.clientY - lastPosition;
        let currentPosition = bar.position().top;
        let newPosition = currentPosition + distance;
        let movedDistance = newPosition - initialPosition;
        let toBottom = movedDistance >= 0;
        if((toBottom && nextElementHeight - movedDistance >= minimumGridHeight) ||
          (!toBottom && currentElementHeight + movedDistance >= minimumGridHeight)) {
          bar.css({top: newPosition});
        }
      }

      function mouseup (evt) {
        finalPosition = bar.position().top;
        adjustHeight();
        moved = false;
        lastPosition = undefined;
        bar.removeClass('moving');
        bar.css({top: ''});
        body.removeClass('resizing');
        body.off('mousemove', mousemove);
        body.off('mouseup', mouseup);
      }

      function adjustHeight () {
        let movedDistance = finalPosition - initialPosition;
        currentElement.height(currentElementHeight + movedDistance);
        nextElement.height(nextElementHeight - movedDistance);
        currentChild.tmpl.height = parseInt(currentElement.css('height'));
        if(!nextIsLast) {
          nextChild.tmpl.height = parseInt(nextElement.css('height'));
        }
        vGridCtrl.$scope.$broadcast('manualResized');
      }

      bindEvent(element, 'mousedown', mousedown, $scope);

    }
  };
}
