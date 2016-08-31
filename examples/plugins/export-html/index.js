import { BasePlugin } from '../../../src/index';
import React, {Component} from 'react'; // eslint-disable-line no-unused-vars
// import ImageRenderer from './image-renderer';
import { SaveButton } from './export-button';

/**
 * This is our plugin
 */
class ExportHtmlPlugin extends BasePlugin {
  constructor(config) {
    config.uiComponents = [{component: SaveButton, type: ''}];
    config.renderComponentsDescriptors = [];
    config.theme = {
    };
    super(config);

  }
}

export default ExportHtmlPlugin;
