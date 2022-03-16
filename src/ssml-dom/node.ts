import type { NodeType } from './utils';

export default class Node {
    type: NodeType = '';
    textContent = '';
    attributes: Record<string, string | boolean | number> = {};
    children: Array<Node> = [];

    constructor(type: NodeType) {
        this.type = type;
    }

    setAttribute(key: string, value: string | boolean | number) {
        this.attributes[key] = value;
    }

    appendChild(child: Node) {
        this.children.push(child);
    }

    removeChild(child: Node) {
        this.children = this.children.filter(item => item !== child);
    }

    toString(): string {
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
