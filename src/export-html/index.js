import exporter from 'draft-js-ast-exporter';
import {ContentState, EditorState} from 'draft-js';

class SerializerStrategy {
  serialize(astNode, inner) {

  }

  deserialize(text, inner) {

  }
}

class Marshaller {
  constructor(serializers) {
    this.serializers = serializers;
  }

  convertToHtml(editorState) {
    const ast = exporter(editorState);


  }
}