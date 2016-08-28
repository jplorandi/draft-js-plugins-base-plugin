import ReactDOM from 'react-dom';
import React from 'react'; // eslint-disable-line no-unused-vars
import EmbeddableEditor from './embeddable-editor'; // eslint-disable-line no-unused-vars

function main() {

  var editorElement = document.body;

  var root = (
      <EmbeddableEditor />
  );

  ReactDOM.render(root, editorElement);

  console.log('Editor Started');

}

main();

export default main;
