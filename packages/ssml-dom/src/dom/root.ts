import { Node } from './node';

export class Root extends Node {
  constructor(locale = 'en-US', addDefaults = false) {
    super('speak');
    if (addDefaults) {
      this.setAttribute('version', '1.1');
      this.setAttribute('xml:lang', locale);
      this.setAttribute('xmlns', 'http://www.w3.org/2001/10/synthesis');
    }
  }
}
