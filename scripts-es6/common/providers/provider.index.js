import {tkgConfig} from './tkg-config';

angular.module('tkgProviders', [])
  .provider('tkgConfig', tkgConfig);

export const tkgProviders = 'tkgProviders';