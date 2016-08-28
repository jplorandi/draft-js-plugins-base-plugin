import {Component} from 'react';
// import {connect} from 'react-redux';
// import {cancelDialog, createEdge} from '../actions/index';
// import {bindActionCreators} from 'redux';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
import createRichButtonsPlugin from 'draft-js-richbuttons-plugin';
import Editor from 'draft-js-plugins-editor'; // eslint-disable-line no-unused-vars
import {EditorState, ContentState} from 'draft-js';
import createImagePlugin from './plugins/image/index';

import createEntityPropsPlugin from 'draft-js-entity-props-plugin';
import {Map} from 'immutable';
import { DefaultDraftBlockRenderMap } from 'draft-js';

const entityPlugin = createEntityPropsPlugin();

const imageTheme = {
  imageLoader: 'imageLoader',
  imageWrapper: 'imageWrapper',
  image: 'image'
};

const imagePlugin = createImagePlugin({
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

    // const entityKey = Entity.create('block-image', 'IMMUTABLE',
    //   {src: 'http://www.proprofs.com/api/ckeditor_images/fruit(3).jpg', progress: -1});
    // const entityKey2 = Entity.create('image', 'IMMUTABLE',
    //   {src: 'http://www.proprofs.com/api/ckeditor_images/fruit(3).jpg', progress: -1});
    //
    //
    // editorState = BlockUtils.insertBlock(editorState, entityKey, ' ', 'block-image');
    // editorState = BlockUtils.insertBlock(editorState, entityKey2, ' ', 'block-image');

    // console.log('DDBM: ', DefaultDraftBlockRenderMap);

    const { blockTypes } = props;
    // eslint-disable-next-line vars-on-top
    var newObj = {
      'paragraph': {
        element: 'div'
      },
      'unstyled': {
        element: 'div'
      },
      'block-image': {
        element: 'span'
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

    this.blockRenderMap = DefaultDraftBlockRenderMap.merge(Map(newObj));

    this.state = {
      editorState: editorState,
      blockRenderMap: this.blockRenderMap
    };
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
        </div>
        <div className='richtext-editor' style={{border: '1px solid rgb(0,0,0)'}}>
          <Editor
            editorState={this.state.editorState}
            blockRenderMap={this.state.blockRenderMap}
            onChange={this.onChange}
            plugins={[entityPlugin, richButtonsPlugin, imagePlugin]}
            ref='editor'

          />
        </div>
      </div>
    );
  }
}

export default EmbeddableEditor;

