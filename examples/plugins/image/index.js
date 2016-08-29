import BasePlugin from '../../../src/index';
import React, {Component} from 'react'; // eslint-disable-line no-unused-vars
import {Entity} from 'draft-js';
import log from 'loglevel'; // eslint-disable-line no-unused-vars

/**
 * This class handles how to render a block inside the editor (WYSIWYG)
 */
class ImageRenderer extends Component {
  constructor(props) {
    super(props);
  }

  renderProgress(progress) {
    return progress >= 0
      ? <div className={this.props.plugin.theme.imageLoader} style={{width: `${100 - progress}%`}}/>
      : null;
  }

  render() {
    const {alignmentClassName, focusClassName, blockProps, style, ...other} = this.props;
    const {theme} = this.props.plugin;
    const {progress, src, url, alt} = blockProps.entityData;
    let {width, height} = blockProps.entityData;

    if (!width) width = '100%';
    if (!height) height = '100%';

    return (
      <span className={[theme.imageWrapper, alignmentClassName].filter(x => x).join(' ')}
            contentEditable={false}
            style={style}>
          <img {...other} src={src || url} alt={alt} width={width} height={height}
               className={[theme.image, focusClassName].filter(x => x).join(' ')}/>
          {this.renderProgress(progress, theme)}
      </span>
    );
  }

}

/**
 * This class is a toolbar component, to create/update/delete a block
 */
class InsertImage extends Component {
  constructor(props) {
    super(props);

    this.onActivate = this.onActivate.bind(this);
  }

  onActivate(event) {
    event.stopPropagation();
    event.preventDefault();

    let value = {url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Humphrey_Bogart_1940.jpg',
      width: 527, height: 746, alt: 'Bogey'};

    const entityKey = Entity.create('block-image', 'IMMUTABLE',
      {src: value.url, progress: -1, width: value.width, height: value.height, alt: value.alt});

    this.props.plugin.insertBlockReplaceSelection(entityKey, 'block-image');

    return false;
  }

  render() {
    return (
      <button onClick={this.onActivate}>Insert Image</button>
    );
  }
}

/**
 * This is our plugin
 */
class AltImagePlugin extends BasePlugin {
  constructor(config) {
    config.uiComponents = [{component: InsertImage, type: 'block-image'}];
    config.renderComponentsDescriptors = [{component: ImageRenderer, type: 'block-image', outerElement: 'span'}];
    config.theme = {
      imageWrapper: 'imageWrapper',
      imageLoader: 'imageLoader',
      image: 'image'
    };
    super(config);

  }
}

export default AltImagePlugin;
