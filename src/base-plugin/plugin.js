import BlockUtils from '../utils/index';
import { makeDecorator } from 'react-decorate';
import log from 'loglevel'; // eslint-disable-line no-unused-vars
import { PropTypes } from 'react';
import Immutable from 'immutable';
import ListenerBus from './listener-bus';

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
    this.serializers = config.serializers || [];
    this.theme = config.theme || {};
    this.store = {
      currentState: undefined,
      getEditorState: undefined,
      setEditorState: undefined,
      getReadOnly: undefined,
      setReadOnly: undefined
    };
    this.listenerBus = new ListenerBus();

    this.toolbarComponents = this.toolbarComponents.bind(this);
    this.blockRendererFn = this.blockRendererFn.bind(this);
  }

  subscribe(event, callback) {
    this.listenerBus.subscribe(event, callback);
  }

  unsubscribe(event, callback) {
    this.listenerBus.unsubscribe(event, callback);
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

    this.store.currentState = editorState;
    this.listenerBus.fireEvent('onChange', editorState);

    return editorState;
  }

  toolbarComponents() {
    var self = this;

    return this.uiComponents.map(function (uiComponent) {
      return PluginAsProp(self)(uiComponent.component);
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

