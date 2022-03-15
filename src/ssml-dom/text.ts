import type { NodeType } from './utils';

export default class TextNode {
    type: NodeType =  "text";
    text = '';

    constructor(text: string) {
        this.text = text;
    }

    toString() {
        return this.text;
    }
}
