// conversation model
import Conversation, { conversationType } from './conversation/conversation';
import withAoG from './conversation/builds/withAoG';
import withRaw from './conversation/builds/withRaw';
// ssml-dom
import Document, { documentType } from './ssml-dom/document';
import Root from './ssml-dom/root';
import XMLDeclaration from './ssml-dom/declaration';
import Node from './ssml-dom/node';
import TextNode from './ssml-dom/text';
// ReactSSML React renderer
import ReactSSML from './ReactSSML';

export default ReactSSML;

export {
  Conversation,
  conversationType,
  withAoG,
  withRaw,
  Document,
  documentType,
  Root,
  XMLDeclaration,
  Node,
  TextNode,
};
