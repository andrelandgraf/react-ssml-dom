export default class Document {
  body = null;

  resolve = undefined;

  isReady = new Promise(resolve => {
    this.resolve = resolve;
  });

  setReady() {
    this.resolve();
  }

  toString() {
    return this.body.toString();
  }
}
