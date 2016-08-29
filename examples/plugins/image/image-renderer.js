import React, {Component} from 'react'; // eslint-disable-line no-unused-vars

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
    const {alignmentClassName, focusClassName, blockProps, style} = this.props;
    const {theme} = this.props.plugin;
    const {progress, src, url, alt} = blockProps.entityData;
    let {width, height} = blockProps.entityData;

    if (!width) width = '100%';
    if (!height) height = '100%';

    return (
      <span className={[theme.imageWrapper, alignmentClassName].join(' ')}
            contentEditable={false}
            style={style}>
          <img src={src || url} alt={alt} width={width} height={height}
               className={[theme.image, focusClassName].join(' ')}/>
        {this.renderProgress(progress, theme)}
      </span>
    );
  }

}

export default ImageRenderer;
