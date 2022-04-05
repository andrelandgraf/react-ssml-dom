<h1 align="center">
  ReactSSML
</h1>
<div align="center">
  <img src="code.png" alt="Hello World SSML" />
</div>

Utilize the full power of React to develop voice UIs. ReactSSML provides a simple custom React renderer that let's you use React and JSX to create [SSML](https://www.w3.org/TR/speech-synthesis11/) output.

## Contents

- [Motivation](#-motivation)
- [Installation Guide](#-installing-reactssml)
- [Demo](#-try-out-the-demo)
- [Architecture](#-how-it-works)
- [Example Apps](#-example-apps-using-reactssml)

## 🌟 Motivation

- Building SSML speech responses with strings is cumbersome.
- Let's treat voice apps as UI.
- Enable composition and declarative syntax.

I wrote a small article about [my motivation](https://medium.com/@andre.timo.landgraf/a-react-renderer-for-ssml-91cdd1d66b3e).

**_What we hate_**

```javascript
const reply = `
<speak>
 ${firstSession ? 'helloLong' : 'helloShort'}
 <audio src='https://s3-bucket/niceSound.mp3'/>
 ${i18n.t(keys.offerHelp)}
 ${showHint ? newFeatureHint : ''}
 ${i18n.t(keys.promptSearch)}
</speak>`;
```

**_What we want_**

```html
<App>
  <SearchProvider>
    <Introduction long="{firstSession}" />
    <BrandedAudio />
    <OfferHelp />
    { showHint && <NewestFeatureHint />
    }
  </SearchProvider>
</App>
```

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

**_Done!_**

```javascript
console.log(ssmlDocument.toString());
```

```html
<speak>
  <s>Hello World!</s>
</speak>
```

## 🌟 Try out the demo

**_Clone this repo and play around with the demo application_**

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

**_Express server is now running on port 8888!_**

Use Postman or a tool of your choice to hit the fulfillment endpoint.

You can find a collection of valid requests in `index.http`

If you are using VS Code, checkout [this plugin](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) to run curl commands with VS Code.

```bash
curl -X POST http://localhost:8888/hello-world
```

And there we go!

```json
{
  "ssml": "<speak version=\"1.1\" xml:lang=\"en-US\" xmlns=\"http://www.w3.org/2001/10/synthesis\">Hello World!</speak>"
}
```

## 🔍 How it works

- react-ssml-dom utilizes `react-reconciler` to implement a custom renderer for React.
- ssml-dom implements a DOM-like API for SSML.
- react-ssml-dom applies React lifecycle methods to SSML nodes.
- You can utilize the conversation object of ssml-dom to store meta data about the conversation.
- Finally you want to render your SSML DOM to a string and your conversation to a payload. This is implemented through the conversation object of ssml-dom and an adapter logic to translate the conversation object to a payload for Google Assistant or other voice platforms.

## 🔛 Example Apps using ReactSSML

- [Covid-19 Stats in SSML](https://github.com/andrelandgraf/covid-stats-ssml)
