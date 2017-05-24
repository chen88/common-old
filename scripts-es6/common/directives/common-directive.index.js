import * as prettyInput from './pretty-input-number';
import * as compile from './compile';
import { rowNavigation } from './row-navigation';
import { autofocus } from './autofocus';

import {tkgNgClick} from './tkg-ng-click';
import {ngRepeat} from './ng-repeat';
import {displayPrice} from './display-price';
import {displayPercent} from './display-percent';
import {selectOnClick} from './select-on-click';
import {uppercase} from './uppercase';
import {tkgHeader, tkgHeaderUser} from './header/header';
import {filterPagination, tkgPagination} from './pagination/pagination';
import {tkgTemplateUrl} from './tkg-template-url';
import {ajaxLoader} from './ajax/ajax';
import {tkgAutoCorrect} from './auto-correct';
import {tkgScrollBody} from './tkg-scroll-body';


export let tkgCommonDir = 'tkgCommonDir';

angular.module(tkgCommonDir, [])
  .directive('prettyNumber', prettyInput.prettyNumber)
  .directive('prettyPercent', prettyInput.prettyPercent)
  .directive('tkgEnter', prettyInput.tkgEnter)
  .directive('compile', compile.compile)
  .directive('rowNavigation', rowNavigation)
  .directive('tkgNgClick', tkgNgClick)
  .directive('ngRepeat', ngRepeat)
  .directive('displayPrice', displayPrice)
  .directive('displayPercent', displayPercent)
  .directive('selectOnClick', selectOnClick)
  .directive('uppercase', uppercase)
  .directive('tkgTemplateUrl', tkgTemplateUrl)
  .directive('tkgHeader', tkgHeader)
  .directive('tkgHeaderUser', tkgHeaderUser)
  .directive('tkgPagination', tkgPagination)
  .directive('ajaxLoader', ajaxLoader)
  .directive('tkgAutoCorrect', tkgAutoCorrect)
  .directive('tkgScrollBody', tkgScrollBody)
  .filter('filterPagination', filterPagination);
