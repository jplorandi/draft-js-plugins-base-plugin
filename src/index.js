import BlockUtils from './utils/index';
import { makeDecorator } from 'react-decorate';
import log from 'loglevel'; // eslint-disable-line no-unused-vars
import { PropTypes } from 'react';
import Immutable from 'immutable';

const PluginAsPropFn = (plugin) => {
  return {
    displayName() {
      return 'plugin';
    },

    propTypes(propTypes) {
      return {
        ...propTypes,
        plugin: PropTypes.object.isRequired
      };
    },

    defaultProps(defaultProps) {
      return {
        ...defaultProps,
        plugin: plugin
      };
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
    this.disableRenderMap = config.disableRenderMap || false;
    this.renderComponentsDescriptors = config.renderComponentsDescriptors || [];
    this.theme = config.theme || {};
    this.store = {
      currentState: undefined,
      getEditorState: undefined,
      setEditorState: undefined,
      getReadOnly: undefined,
      setReadOnly: undefined
    };

    this.toolbarComponents = this.toolbarComponents.bind(this);
    this.blockRendererFn = this.blockRendererFn.bind(this);
  }

  blockRendererFn(contentBlock) {
    const blockType = contentBlock.getType();

    let descriptor = this.renderComponentsDescriptors.filter((item) => {
      if (item.type === blockType) return item;
      return null;
    });

    if (descriptor[0]) {
      const CustomRenderComponent = PluginAsProp(this)(descriptor[0].component);

      return {
        component: CustomRenderComponent,
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

    return editorState;
  }

  notifyBound(editorState) {
    if (this.store.currentState !== editorState) {
      this.store.currentState = this.store.getEditorState();
      this.uiComponents.forEach(function (bound) {
        // bound.notifyUpdate(editorState);
      });
    }
  }

  toolbarComponents() {
    var self = this;

    return this.uiComponents.map(function (uiComponent) {
      const decorated = PluginAsProp(self)(uiComponent.component);

      return decorated;
    });
  }

  blockRenderMap() {
    var map = {};

    if (this.disableRenderMap) return {};
    this.renderComponentsDescriptors.forEach(function (item) {
      if (item.type && item.outerElement) {
        map[item.type] = item.outerElement;
      }
    });

    log.trace('map: ', map);
    return Immutable.Map(map);
  }

  marshaller() {
    return {};
  }
}

export default BasePlugin;

