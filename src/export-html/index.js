import exporter from 'draft-js-ast-exporter';
// import {ContentState, EditorState} from 'draft-js';
import log from 'loglevel'; // eslint-disable-line no-unused-vars

export class SerializerStrategy {
  isValid(astNode) {

  }

  serialize(astNode) {

  }

  deserialize(text) {

  }
}

class BlockSerializer extends SerializerStrategy {
  isValid(astNode) {
    if (typeof astNode[0] === 'string' && astNode[0] === 'block') {
      return true;
    }
    return false;
  }

  serialize(astNode) {
    return ['<div>', astNode[astNode.length - 1], '</div>'];
  }
}

class NilSerializer extends SerializerStrategy {
  isValid(astNode) {
    if (Array.isArray(astNode[0])) {
      return true;
    }
    return false;
  }

  serialize(astNode) {
    return ['', astNode[0], ''];
  }
}

class InlineSerializer extends SerializerStrategy {
  constructor() {
    super();
    this.styles = [
      {draft: 'BOLD', html: 'strong'},
      {draft: 'ITALIC', html: 'i'},
      {draft: 'UNDERLINE', html: 'u'},
      {draft: 'CODE', html: 'code'}
    ];

  }

  isValid(astNode) {
    if (typeof astNode[0] === 'string' && astNode[0] === 'inline') {
      return true;
    }
    return false;
  }

  findStyles(style) {
    let rval;
    let tmp;

    log.trace('finding style for: ', style);
    rval = this.styles.filter((knownStyle) => {
      tmp = false;
      style.forEach((s) => {
        if (knownStyle.draft === s) {
          tmp = true;
        }
      });
      return tmp;
    });
    log.trace('found styles: ', rval);

    return rval;
  }

  serialize(astNode) {
    const style = this.findStyles(astNode[1][0]);
    let rval = [];
    let index = 0;

    if (style.length) {
      log.trace('style: ', style);
      style.forEach((item) => {
        rval.splice(index++, 0, '<' + item.html + '>');
        rval.splice(index, 0, '</' + item.html + '>');
      });
      rval.splice(index, 0, astNode[1][1]);
      return [rval.join(''), null, ''];
    }

    return [astNode[1][1], null, ''];

  }
}

class SpanSerializer extends SerializerStrategy {
  isValid(astNode) {
    if (typeof astNode[0] === 'string' && astNode[0] === 'unstyled') {
      return true;
    }
    return false;
  }

  serialize(astNode) {
    return ['<span>', astNode[astNode.length - 1], '</span>', true];
  }
}

export class Marshaller {
  constructor(serializers) {
    this.serializers = [new BlockSerializer(), new SpanSerializer(),
      new NilSerializer(), new InlineSerializer()].concat(serializers);
  }

  convertToHtml(editorState) {
    var output = [];
    const ast = exporter(editorState);
    let stack = [{depth: 0, element: ast}];
    let outputOffset = 0;
    var current, serialized, element, strategy;
    var depth;

    while (stack.length) {
      current = stack.pop();
      log.trace('Current: ', current);

      depth = current.depth;
      element = current.element;
      strategy = this.findStrategy(element);

      if (strategy) {
        // log.trace('Strategy found for element: ', strategy);

        serialized = strategy.serialize(element);
        output.splice(outputOffset++, 0, serialized[0]);
        output.splice(outputOffset, 0, serialized[2]);
        if (serialized[3]) {
          serialized[1].reverse().forEach((item) => {
            stack.push({depth: depth + 1, element: item});
          });

        } else {
          stack.push({depth: depth + 1, element: serialized[1]});
        }
      } else {
        log.trace('No strategy found for element: ', element);
      }
    }

    return output.join('');
  }

  findStrategy(element) {
    if (element == null) {
      return null;
    }

    return this.serializers.reduce((previous, serializer) => {
      // log.trace('findStrat: ', previous, serializer);
      if (previous) {
        return previous;
      }

      if (serializer.isValid(element)) {
        return serializer;
      }

      return null;
    }, null);
  }
}

export default Marshaller;
