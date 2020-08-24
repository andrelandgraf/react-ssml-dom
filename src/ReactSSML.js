import ReactReconciler from 'react-reconciler';

import Node from './ssml-dom/node';
import TextNode from './ssml-dom/text';

const rootHostContext = {};
const childHostContext = {};

const reconciler = ReactReconciler({
  /* host config for ssml */
  now: Date.now,
  supportsMutation: true,
  getRootHostContext: () => rootHostContext,
  prepareForCommit: () => {},
  resetAfterCommit: () => {},
  getChildHostContext: () => childHostContext,
  shouldSetTextContent: (type, props) =>
    typeof props.children === 'string' || typeof props.children === 'number',
  createInstance: (
    type,
    props,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) => {
    const domElement = new Node(type);
    Object.keys(props).forEach(propName => {
      const propValue = props[propName];
      if (propName === 'children') {
        if (typeof propValue === 'string' || typeof propValue === 'number') {
          domElement.textContent = propValue;
        }
      } else {
        domElement.setAttribute(propName, propValue);
      }
    });
    return domElement;
  },
  createTextInstance: text => new TextNode(text),
  appendChildToContainer: (container, child) => {
    container.appendChild(child);
  },
  appendInitialChild: (parent, child) => {
    parent.appendChild(child);
  },
  appendChild(parent, child) {
    parent.appendChild(child);
  },
  finalizeInitialChildren: (domElement, type, props) => {},
  prepareUpdate(domElement, oldProps, newProps) {
    return true;
  },
  commitUpdate(domElement, updatePayload, type, oldProps, newProps) {
    Object.entries(newProps).forEach(([propName, propValue]) => {
      if (propName === 'children') {
        if (typeof propValue === 'string' || typeof propValue === 'number') {
          domElement.textContent = propValue;
        }
      } else {
        domElement.setAttribute(propName, propValue);
      }
    });
  },
  commitTextUpdate(textInstance, oldText, newText) {
    textInstance.text = newText;
  },
  removeChildFromContainer(container, child) {
    container.removeChild(child);
  },
  removeChild(parentInstance, child) {
    parentInstance.removeChild(child);
  },
});

const ReactSSML = {
  /**
   * @param {*} element what to render
   * @param {*} container where to render
   */
  render(element, container, callback) {
    const reactiveContainer = reconciler.createContainer(
      container,
      false,
      false
    );
    reconciler.updateContainer(element, reactiveContainer, null, null);
  },
};

export default ReactSSML;
