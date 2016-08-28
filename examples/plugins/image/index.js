import BasePlugin from '../../../src/index';
import React, {Component} from 'react';
import {Entity} from 'draft-js';


/**
 * This class handles how to render a block inside the editor (WYSIWYG)
 */
class ImageRenderer extends Component {
  constructor(props) {
    this.plugin = props.plugin;
  }

  renderProgress(progress) {
    return progress >= 0
      ? <div className={theme.imageLoader} style={{width: `${100 - progress}%`}}/>
      : null;
  }

  render() {
    const {alignmentClassName, focusClassName, blockProps, style, ...other} = this.props;
    const {progress, src, url, alt} = blockProps.entityData;
    let {width, height} = blockProps.entityData;
    if (!width) width = "100%";
    if (!height) height = "100%";

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
    this.plugin = props.plugin;
  }

  onActivate(event) {
    event.stopPropagation();
    event.preventDefault();

    const entityKey = Entity.create('block-image', 'IMMUTABLE',
      {src: value.url, progress: -1, width: value.width, height: value.height});
    this.plugin.insertBlockReplaceSelection(entityKey, 'block-image');

    return false;
  }
}

/**
 * This is our plugin
 */
class AltImagePlugin extends BasePlugin {
  constructor(config) {
    config.uiComponents = [{component: InsertImage, type: 'block-image'}];
    config.renderComponentsDescriptors = [{component: ImageRenderer, type: 'block-image'}];
    super(config);

  }


}

export default AltImagePlugin;