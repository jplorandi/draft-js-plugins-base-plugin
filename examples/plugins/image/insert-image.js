import React from 'react'; // eslint-disable-line no-unused-vars
import {Entity} from 'draft-js';

/**
 * This class is a toolbar component, to create/update/delete a block
 */
export class InsertImage extends React.Component {
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

export default InsertImage;

