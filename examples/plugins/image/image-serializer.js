import { SerializerStrategy } from '../../../src/export-html/index';
import log from 'loglevel';

export class ImageSerializer extends SerializerStrategy {
  isValid(astNode) {
    if (typeof astNode[0] === 'string' && astNode[0] === 'block-image') {
      return true;
    }
    return false;
  }

  serialize(astNode) {
    let properties = astNode[2][0][1][3];

    log.trace('img ast: ', astNode);

    return [`<img src="${properties.src}" width="${properties.width}" height="${properties.height}" ` +
    `alt="${properties.alt}"/>`,
      astNode[astNode.length - 1], '', false];
  }
}

export default ImageSerializer;
