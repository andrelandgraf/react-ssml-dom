export default class XMLDeclaration {
    version = '1.0';

    toString() {
        return `<?xml version="${this.version}"?>`;
    }
}
