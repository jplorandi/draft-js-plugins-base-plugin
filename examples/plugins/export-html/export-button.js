import React from 'react'; // eslint-disable-line no-unused-vars
import exporter from 'draft-js-ast-exporter';
import {Marshaller} from '../../../src/export-html/index';

/**
 * This class is a toolbar component, to create/update/delete a block
 */
export class SaveButton extends React.Component {
  constructor(props) {
    super(props);

    this.onActivate = this.onActivate.bind(this);
    this.marshaller = new Marshaller([]);
  }

  onActivate(event) {
    event.stopPropagation();
    event.preventDefault();

    const editorState = this.props.plugin.store.getEditorState();
    const ast = exporter(editorState);

    console.log('ast', ast);
    console.log('HTML', this.marshaller.convertToHtml(editorState));
    alert(this.marshaller.convertToHtml(editorState));

    return false;
  }

  render() {
    return (
      <button onClick={this.onActivate}>Save HTML</button>
    );
  }
}

export default SaveButton;

