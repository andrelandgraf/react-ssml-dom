import { XMLDeclaration } from './declaration';
import type { Node } from './node';
import { Root } from './root';

export class Document {
  /* the xml document prolog */
  xmlDeclaration = new XMLDeclaration();
  // include prolog in string version
  includeProlog = false;
  // locale e.g. en-US, de-DE, ...
  locale;
  // the document body, usually of type speak
  body: Node | null = null;

  constructor(locale = 'en-US', addDefaultRoot = true, includeProlog = false) {
    this.locale = locale;
    this.includeProlog = includeProlog;
    if (addDefaultRoot) {
      this.body = new Root(locale, true);
    }
  }

  toString() {
    if (this.includeProlog) {
      return `
        ${this.xmlDeclaration.toString()}
        ${this.body?.toString()}
      `
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    return this.body?.toString() || '';
  }
}
