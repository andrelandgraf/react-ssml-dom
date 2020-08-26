<h1 align="center">
  ReactSSML
</h1>
<div align="center">
  <img src="code.png" alt="Hello World SSML" />
</div>

## ❓What is this?

Utilize the full power of React to develop voice UIs. ReactSSML provides a simple custom React renderer that let's you use React and JSX to create SSML output.

I wrote a small article about [my motivation](https://medium.com/@andre.timo.landgraf/a-react-renderer-for-ssml-91cdd1d66b3e).

This project is brand new, so if you run into issues or have questions, open up an issue and let me know! Any feedback is highly appreciated.

## 🚀 Installing ReactSSML

Get the package from [npm](https://www.npmjs.com/package/react-ssml-dom).

```bash
npm i react-ssml-dom
```

Create an App component

```javascript
import React from 'react';

const App = () => <s>Hello World</s>;

export default App;
```

Render your App

```javascript
import ReactSMML, { Document, Node } from 'react-ssml-dom';

// create a document similar to the DOM's document
const ssmlDocument = new Document();
// create a root node similar to the body in HTML
const root = new Node('speak');
ssmlDocument.body = root;

ReactSMML.render(<App />, root);
```

***Done!***

```javascript
console.log(ssmlDocument.toString())
```

```html
<speak>
  <s>Hello World!</s>
</speak>
```

## 🌟 Next steps

***Clone this repo and play around with the demo application***

Get the source code

```bash
git clone https://github.com/andrelandgraf/react-ssml-dom.git
```

Build the demo

```bash
npm run build:demo
```

Run the demo 

```bash
npm run start:demo

> react-ssml@1.0.2 start:demo /react-ssml
> node dist/main.js

Express backend listening on port 8888! 🚀
```

***Express server is now running on port 8888!***

Use Postman or a tool of your choice to hit the fulfillment endpoint.

```bash
curl -X POST http://localhost:8888
```

And there we go!

```json
{
  "reply": "<speak> <audio src=\"https://s3-bucket.com/mock-song.ogg\">  Oh, I am sorry, this file seems not to work, please try another song</audio> </speak>"
}
```

## 🔍 How it works 

This project is using `react-reconciler` to implement a custom renderer for React.

See: `./src/ReactSSML.js` which replaces `react-dom`

On top of that this project implements a (proof-of-concept) version of the web's DOM for SSML.

See: `./src/ssml-dom/*`

The demo folder contains a demo React App. The demo express server runes via `.index.js`

Set `receivedError` in `./demo/Reply.jsx` to `true` and see how the response SSML changes.

Also, try to set the timeout time in `./demo/Reply.jsx` from `3000` to `8000` which is higher as our global timeout in `index.js`. See what happens to get an idea of how this project works.