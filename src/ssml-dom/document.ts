import XMLDeclaration from './declaration';
import Node from './node';
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
    body: Node | null = null;
    // romise resolve callback function
    resolve: ((value: unknown) => void) | undefined = undefined;

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
        if (this.resolve) {
            this.resolve(undefined);
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
