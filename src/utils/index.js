'use strict';

import { BlockMapBuilder, CharacterMetadata, ContentBlock } from 'draft-js';
import { Modifier, EditorState, genKey } from 'draft-js';
import Immutable from 'immutable';

const List = Immutable.List;
const Repeat = Immutable.Repeat;

const DraftModifier = Modifier;

let BlockUtils = {
  insertBlock: function insertAtomicBlock(editorState, entityKey, character, blockType) {
    let contentState = editorState.getCurrentContent();
    let selectionState = editorState.getSelection();

    let afterRemoval = DraftModifier.removeRange(contentState, selectionState, 'backward');

    let targetSelection = afterRemoval.getSelectionAfter();
    let afterSplit = DraftModifier.splitBlock(afterRemoval, targetSelection);
    let insertionTarget = afterSplit.getSelectionAfter();

    let asAtomicBlock = DraftModifier.setBlockType(afterSplit, insertionTarget, blockType);

    let charData = CharacterMetadata.create({ entity: entityKey });

    let fragmentArray = [new ContentBlock({
      key: genKey(),
      type: blockType,
      text: character,
      characterList: List(Repeat(charData, character.length))
    }), new ContentBlock({
      key: genKey(),
      type: 'unstyled',
      text: '',
      characterList: List()
    })];

    let fragment = BlockMapBuilder.createFromArray(fragmentArray);

    let withAtomicBlock = DraftModifier.replaceWithFragment(asAtomicBlock, insertionTarget, fragment);

    let newContent = withAtomicBlock.merge({
      selectionBefore: selectionState,
      selectionAfter: withAtomicBlock.getSelectionAfter().set('hasFocus', true)
    });

    return EditorState.push(editorState, newContent, 'insert-fragment');
  }
};

module.exports = BlockUtils;
