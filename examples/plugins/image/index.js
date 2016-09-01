import { BasePlugin } from '../../../src/index';
import React, {Component} from 'react'; // eslint-disable-line no-unused-vars

import ImageRenderer from './image-renderer';
import InsertImage from './insert-image';
import ImageSerializer from './image-serializer';

/**
 * This is our plugin
 */
class AltImagePlugin extends BasePlugin {
  constructor(config) {
    config.uiComponents = [{component: InsertImage, type: 'block-image'}];
    config.renderComponentsDescriptors = [{component: ImageRenderer, type: 'block-image', outerElement: 'span'}];
    config.serializers = [new ImageSerializer()];
    config.theme = {
      imageWrapper: 'imageWrapper',
      imageLoader: 'imageLoader',
      image: 'image'
    };
    super(config);

  }
}

export default AltImagePlugin;
