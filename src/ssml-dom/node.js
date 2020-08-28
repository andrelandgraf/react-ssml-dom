export default class Node {
  type = '';

  textContent = '';

  attributes = {};

  children = [];

  constructor(type) {
    this.type = type;
  }

  setAttribute(key, value) {
    this.attributes[key] = value;
  }

  appendChild(child) {
    this.children.push(child);
  }

  removeChild(child) {
    this.children = this.children.filter(item => item !== child);
  }

  toString() {
    const tag = Object.keys(this.attributes).length
      ? `<${this.type} ${Object.entries(this.attributes)
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ')}>`
      : `<${this.type}>`;
    const innerSSML = this.children.length
      ? this.children.map(child => child.toString()).join(' ')
      : this.textContent;
    return `${tag}${innerSSML}</${this.type}>`
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
