import XMLDeclaration from './declaration';
import Root from './root';

export default class Document {
  /* the xml document prolog */
  xmlDeclaration = new XMLDeclaration();

  // include prolog in string version
  includeProlog = false;

  // locale e.g. en-US, de-DE, ...
  locale;

  // language e.g. en, de, ...
  language;

  // the document body, usually of type speak
  body = null;

  // promise resolve callback function
  resolve = undefined;

  constructor(locale = 'en-US', addDefaultRoot = true, includeProlog = false) {
    this.locale = locale;
    this.language = locale.slice(0, 2);
    this.includeProlog = includeProlog;
    if (addDefaultRoot) {
      this.body = new Root(locale, true);
    }
  }

  // promise side effect that can be awaited until the app is finalized
  isReady = new Promise(resolve => {
    this.resolve = resolve;
  });

  // resolves isReady
  setReady() {
    this.resolve();
  }

  toString() {
    if (this.includeProlog) {
      return `
        ${this.xmlDeclaration.toString()}
        ${this.body.toString()}
      `
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    return this.body.toString();
  }
}
