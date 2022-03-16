import ReactReconciler from 'react-reconciler';

import Node from './ssml-dom/node';
import TextNode from './ssml-dom/text';

const rootHostContext = {};
const childHostContext = {};

const reconciler = ReactReconciler<any, any, Node, any, any, any, any, any, any, any, any, any, any>({
    /* host config for ssml */
    now: Date.now,
    supportsMutation: true,
    isPrimaryRenderer: true,
    noTimeout: -1,
    supportsPersistence: false,
    supportsHydration: false,
    getRootHostContext: () => rootHostContext,
    prepareForCommit: () => null,
    resetAfterCommit: () => undefined,
    getChildHostContext: () => childHostContext,
    shouldSetTextContent: (type, props) => typeof props.children === 'string' || typeof props.children === 'number',
    createInstance: (type, props, rootContainerInstance, hostContext, internalInstanceHandle) => {
        const domElement = new Node(type);
        Object.keys(props).forEach(propName => {
            const propValue = props[propName];
            if (propName === 'children') {
                if (typeof propValue === 'string' || typeof propValue === 'number') {
                    domElement.textContent = String(propValue);
                }
            } else {
                domElement.setAttribute(propName, propValue);
            }
        });
        return domElement;
    },
    clearContainer: container => {
        container.children = [];
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
    finalizeInitialChildren: (domElement, type, props) => true,
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
    cancelTimeout: () => undefined,
    getPublicInstance: instance => instance,
    preparePortalMount: () => undefined,
    scheduleTimeout: () => undefined,
});

const ReactSSML = {
    /**
     * @param {JSX.Element} element what to render
     * @param {Node} container where to render
     */
    render(element: JSX.Element, container: Node) {
        const reactiveContainer = reconciler.createContainer(container, 0, false, null);
        reconciler.updateContainer(element, reactiveContainer, null, null);
    },
};

export default ReactSSML;
