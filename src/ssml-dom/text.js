export default class TextNode {
  type = '';

  text = '';

  constructor(text) {
    this.type = 'text';
    this.text = text;
  }

  toString() {
    return this.text;
  }
}
