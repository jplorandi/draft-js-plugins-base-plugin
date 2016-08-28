import BlockUtils from './utils/index';
import { makeDecorator } from 'react-decorate';

const PluginAsPropFn = (plugin) => {
  return {
    displayName() {
      return 'plugin';
    },
    nextProps(props) {
      return {
        ...props,
        plugin: plugin
      };
    }
  };
};

export const PluginAsProp = makeDecorator(PluginAsPropFn);

/**
 * The base plugin, extend this class to create your own plugins
 */
export class BasePlugin {
  constructor(config) {
    this.uiComponents = config.uiComponents || [];
    this.disableRenderMap = config.disableRenderMap;
    this.renderComponentsDescriptors = config.renderComponentsDescriptors || [];
    this.theme = config.theme || {};
    this.store = {
      currentState: undefined,
      getEditorState: undefined,
      setEditorState: undefined,
      getReadOnly: undefined,
      setReadOnly: undefined
    };
  }

  blockRendererFn(contentBlock) {
    const blockType = contentBlock.getType();
    let descriptor = this.renderComponentsDescriptors.reduce(
      function (item, previous) {
        if (previous) return previous;
        if (blockType === item.type) {
          return descriptor;
        }
        return null;
      }, null
    );

    if (descriptor) {
      return {
        component: descriptor.renderComponent,
        editable: false
      };
    }
    return undefined;
  }

  insertBlockReplaceSelection(entityKey, blockType) {
    const newState = BlockUtils.insertBlock(this.store.getEditorState(), entityKey, ' ', blockType);

    this.store.setEditorState(newState);
    this.onChange(newState);
  }

  initialize(pluginFunctions) {
    this.store.getEditorState = pluginFunctions.getEditorState;
    this.store.setEditorState = pluginFunctions.setEditorState;
    this.store.currentState = this.store.getEditorState();
  }

  onChange(editorState) {
    this.notifyBound(editorState);
  }

  notifyBound(editorState) {
    if (this.store.currentState !== editorState) {
      this.store.currentState = this.store.getEditorState();
      this.uiComponents.forEach(function (bound) {
        bound.notifyUpdate(editorState);
      });
    }
  }

  toolbarComponents() {
    return this.uiComponents.map(function (uiComponent) {
      PluginAsProp(this)(uiComponent.component);
    });
  }

  blockRenderMap() {
    if (!this.disableRenderMap) return undefined;
    return Map();
  }

  marshaller() {
    return {};
  }
}

export default BasePlugin;

