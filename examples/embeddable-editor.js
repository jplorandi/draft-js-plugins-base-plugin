import React, {Component} from 'react'; // eslint-disable-line no-unused-vars
// import {connect} from 'react-redux';
// import {cancelDialog, createEdge} from '../actions/index';
// import {bindActionCreators} from 'redux';
import Draft from 'draft-js'; // eslint-disable-line no-unused-vars
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
import createRichButtonsPlugin from 'draft-js-richbuttons-plugin';
import Editor from 'draft-js-plugins-editor'; // eslint-disable-line no-unused-vars
import {EditorState, ContentState} from 'draft-js';
import AltImagePlugin from './plugins/image/index';
import uuid from 'uuid';

import createEntityPropsPlugin from 'draft-js-entity-props-plugin';
import {Map} from 'immutable';
import { DefaultDraftBlockRenderMap } from 'draft-js';

const entityPlugin = createEntityPropsPlugin();

const imageTheme = {
  imageLoader: 'imageLoader',
  imageWrapper: 'imageWrapper',
  image: 'image'
};

const imagePlugin = new AltImagePlugin({
  theme: imageTheme
});

const richButtonsPlugin = createRichButtonsPlugin();
// eslint-disable-next-line no-unused-vars
const { ItalicButton, BoldButton, MonospaceButton, UnderlineButton } = richButtonsPlugin;

class EmbeddableEditor extends Component {
  constructor(props, context) {
    super(props, context);
    // const value = this.props.value || '';
    const content = DraftPasteProcessor.processHTML('<p>AAAAA</p>');
    const state = ContentState.createFromBlockArray(content);
    let editorState = EditorState.createWithContent(state);

    this.plugins = [entityPlugin, richButtonsPlugin, imagePlugin];

    const { blockTypes } = props;
    // eslint-disable-next-line vars-on-top
    var newObj = {
      'paragraph': {
        element: 'div'
      },
      'unstyled': {
        element: 'div'
      },
      'block-table': {
        element: 'div'
      }
    };

    // eslint-disable-next-line vars-on-top
    for (var key in blockTypes) {
      newObj[key] = {
        element: 'div'
      };
    }

    this.blockRenderMap = DefaultDraftBlockRenderMap.merge(Map(newObj)).merge(imagePlugin.blockRenderMap());

    this.state = {
      editorState: editorState,
      blockRenderMap: this.blockRenderMap
    };

    const toolbarComponents = imagePlugin.toolbarComponents();

    console.log('components: ', toolbarComponents);
    this.buttons = toolbarComponents.map((Button) => <Button key={uuid.v4() } />);

    this.onChange = this.onChange.bind(this);
  }

  onChange(editorState) {
    this.setState({editorState: editorState});
    if (this.props.onChange) {
      const md = editorState.toString('markdown');

      console.log(md);
      this.props.onChange(md);
    }
  }

  render() {
    return (
      <div>
        <div className='editor-toolbar'>
          <ItalicButton/>
          <BoldButton/>
          <MonospaceButton/>
          <UnderlineButton/>
          {this.buttons}
        </div>
        <div className='richtext-editor' style={{border: '1px solid rgb(0,0,0)'}}>
          <Editor
            editorState={this.state.editorState}
            blockRenderMap={this.state.blockRenderMap}
            onChange={this.onChange}
            plugins={this.plugins}
            ref='editor'

          />
        </div>
      </div>
    );
  }
}

export default EmbeddableEditor;
