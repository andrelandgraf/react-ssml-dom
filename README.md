<h1 align="center">
  ReactSSML
</h1>
<div align="center">
  <img src="code.png" alt="Hello World SSML" />
</div>

Utilize the full power of React to develop voice UIs. ReactSSML provides a simple custom React renderer that let's you use React and JSX to create [SSML](https://www.w3.org/TR/speech-synthesis11/) output.

This project is brand new, so if you run into issues or have questions, open up an issue and let me know! Any feedback is highly appreciated.

## Contents

-   [Motivation](#-motivation)
-   [Installation Guide](#-installing-reactssml)
-   [Demo](#-try-out-the-demo)
-   [Documentation](#-documentation)
-   [Architecture](#-how-it-works)
-   [Example Apps](#-example-apps-using-reactssml)

## 🌟 Motivation

-   Building SSML speech responses with strings is cumbersome.
-   Let's treat voice apps as UI.
-   Enable composition and declarative syntax.

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

## 📖 Documentation

### Content

-   ReactSSML
-   **_ssml-dom_**
    -   Document
    -   XMLDeclaration
    -   Root
    -   Node
    -   TextNoode
-   **_conversation_**
    -   Conversation
    -   **_builders_**
        -   withRaw
        -   withAoG

### ReactSSML

ReactSSML works like ReactDOM. It provides one function `render` that takes your react App component and your `ssml-dom` node that your app should render in. Typically, that would be your root node.

```javascript
import ReactSMML from 'react-ssml-dom';

ReactSMML.render(<App />, root);
```

### ssml-dom: Document

Document works similar to the `document` global variable. Initialize a new Document with the following constructor parameters:

**_constructor_**

| param          | default     | description                                                   |
| -------------- | ----------- | ------------------------------------------------------------- |
| locale         | 'en-locale' | document locale                                               |
| addDefaultRoot | true        | if true, it will add a default Root node as the document body |
| includeProlog  | false       | if true, it will add a default XMLDeclaration to the document |

```javascript
import { Document } from 'react-ssml-dom';

// those are the default parameters
const doc = new Document('en-US', true, false);
```

**_toString_** {function}

Call the `toString` to create a string representation of the SSML document.

**_isReady_** {Promise}

At some point you want to return the SSML to your user. For that you have to know if the React app has the desired state. `doc.isReady` provides a Promise that can be awaited before returning the SSML. The promise can be resolved with `doc.setReady()`.

Checkout `./index` which makes use of `await doc.isReady`. In the demo, the React app get rendered serverside within an express.js endpoint. `await doc.isReady` is used before returning the SSML to the client. Within the demo app, the promise is resolved by calling `doc.setReady()`. This is useful if you have to fetch data in your React app and think the app will render a view times.

**_setReady_** {function}

Resolves the promise `doc.isReady` and can for example be called after your React app successfully fetched data and is about to render its final SSML.

#### Document PropType: documentType

Note: You can use the `documentType` propType if you are using `prop-types` in your project.

```javascript
import { documentType } from 'react-ssml-dom';

const App = ({ doc }) => <>Current language is {doc.language}</>;

App.propTypes = {
    doc: documentType,
};
```

### smml-dom: XMLDeclaration

By definition [SSML](https://www.w3.org/TR/speech-synthesis11/) documents start with a XML declaration. Some speech synthesizer will require a valid declaration to parse the SSML.

-   Add a default XMLDeclaration to the Document by setting the `includeProlog` parameter to true
-   You can always alter the XMLDeclaration like so:

```javascript
import { Document } from 'react-ssml-dom';

const doc = new Document('en-US', true, false);
doc.includeProlog = true;
doc.xmlDeclaration.version = '1.1'; // '1.0' is the default
```

### smml-dom: Root

Root extends Node and defaults its type to 'speak'. You can create your own Root node and set it to `doc.body`. Initialize a new Root node with the following constructor parameters:

**_constructor_**

| param       | default     | description                                         |
| ----------- | ----------- | --------------------------------------------------- |
| locale      | 'en-locale' | document locale                                     |
| addDefaults | true        | if true, it will add default attributes to the node |

The default attributes:

```
version="1.1"
xml:lang="en-US"
xmlns="http://www.w3.org/2001/10/synthesis"
```

```javascript
import { Document, Root } from 'react-ssml-dom';

const doc = new Document('en-US', false, false);
// those are the default parameters
doc.body = new Root('en-US', false);
```

### smml-dom: Node

Similar to a DOM node of the browser DOM implementation. It has a `type` and a list of `attributes` and can render to a string by calling `toString`.

**_type_** {string}

All possible SSML tags are allowed types.

**_toString_** {function}

### smml-dom: TextNode

Similar to a DOM textNode of the browser DOM implementation. It has a `text` field and can render to a string by calling `toString`.

**_toString_** {function}

### conversation: Conversation (optional)

Similar to the `window` global variable in the browser environment.

You don't need to work with the conversation model, it is entierly optional and might be abstracted into it's own package in the future. `Conversation` provides an abstraction layer for a voice dialog and could be a way for you to access the request (intent, parameters, ...) and the response (endConversation, reply, contexts, ...) of the ongoing conversation within your React component.

The idea is that all requests and responses can be abstracetd into the conversation model. Most likely you will use `ReactSSML` to create voice apps for Amazon Alexa, Google Assistant, or any other popular nlu provider or voice assistant. `Conversation` aims to provide an abstraction layer to and from any target environment.

This is how it works:

```javascript
import { Conversation } from 'react-ssm-dom';
// parse request body (e.g. express.js request body) to conversation model
const conv = new Conversation(req.body);
// access common parameters of any voice environment
const intent = conv.intent;
conv.response.endConversation = false;
// and parse the final user response back to the target environment model
const payload = conv.buildPayload(ssmlReply);
```

**_Conversation Model_**

| fields          | default                                            | type   | description                                                       |
| --------------- | -------------------------------------------------- | ------ | ----------------------------------------------------------------- |
| locale          | 'en-locale'                                        | string | the locale of the conversation                                    |
| intent          | undefined                                          | string | the current intent of the user                                    |
| target          | undefined                                          | string | the target env, e.g. default, aog, ...                            |
| parameters      | {}                                                 | object | list of parameters / slots the user filled                        |
| originalRequest | undefined                                          | object | the actual request object                                         |
| user            | undefined                                          | object | the user object                                                   |
| queryText       | undefined                                          | string | the actual query of the user                                      |
| sessionId       | undefined                                          | string | the sessionId unique across all conversations                     |
| response        | { reply: '', contexts: [], endConversation: true } | object | the response object that will be filled and sent back to the user |

#### Conversation PropType: conversationType

Note: You can use `conversationType` propType if you are using the conversation object within your React app and want to utilize `prop-types`.

```javascript
import { conversationType } from 'react-ssml-dom';

const App = ({ conv }) => <>Current intent is {conv.intent}</>;

App.propTypes = {
    conv: conversationType,
};
```

### conversation: builders (withAoG, withRaw)

You can create your own builders to build a conversation model from your request and
build a payload back from that conversation once your conversation is ready.

This package comes with a set of builders already:

-   withRaw
-   withAoG

### conversation: builder withRaw

The default builder is registered by default. If no other builder `canBuildConversation` the default builder will try to build the conversation.

### conversation: builder withAoG

A builder to parse the dialogflow actions on google request to the conversation model and the conversation back to a dialogflow response.

**_register a builder_**

You can register your custom builders or any of the builders of this package like so:

```javascript
import { Conversation, withAoG } from 'react-smml-dom';

// similar to how express use works, you can add as many builders as you want
Conversation.useBuilder(withAoG);
```

**_useBuilder_** {function}

`useBuilder` takes two arguments.

| param   | default   | description                                                        |
| ------- | --------- | ------------------------------------------------------------------ |
| builder | required! | the builder                                                        |
| map     | {}        | a map that can be used to help the builder parse to the conv model |

A map for the `withAoG` builder could look like follows:

```javascript
const aogMap = {
    parameters: {
        'geo-country': value => (Array.isArray(value) ? 'countries' : 'country'),
    },
};
```

This map will take any AoG parameter with the key `geo-country` and parse it depending on it's value as a parameter with the key name `countries` or `country`.

### Build your own builder

a builder has to offer the following functions and fields:

| fields               | type     | expected return value | parameters   | description                                                                                                                                                   |
| -------------------- | -------- | --------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| target               | string   | -                     | -            | the name of the target environment.                                                                                                                           |
| canBuildConversation | function | boolean               | request      | should return true if the builder can handle the given request and false if not, the first builder that return true will be picked to build the conversation. |
| buildConversation    | function | object                | request, map | should return an object with all the fields that the request can fill for the conversation.                                                                   |
| buildPayload         | function | object                | conversation | should return the payload that can be sent to the user.                                                                                                       |

## 🔍 How it works

This project is using `react-reconciler` to implement a custom renderer for React.

See: `./src/ReactSSML.js` which works like `react-dom`.

On top of that this project implements a (proof-of-concept) version of the web's DOM for SSML.

See: `./src/ssml-dom/*`

The `./src/conversation/*` folder implements a conversation model that abstracts away the target environment. You can think of the `conversation` object to something similar as the `window` on the web. On top of that it enables abstracting away the target environment. The vision is to use the same code base (React App) for Actions on Google, Alexa Skills and all possible target environments and translate the different requests into the `conversation` model.

The demo folder contains a demo React App. The demo express server runes via `.index.js`

Set `receivedError` in `./demo/Reply.jsx` to `true` and see how the response SSML changes.

Also, try to set the timeout time in `./demo/Reply.jsx` from `3000` to `8000` which is higher as our global timeout in `index.js`. See what happens to get an idea of how this project works.

## 🔛 Example Apps using ReactSSML

-   [Covid-19 Stats in SSML](https://github.com/andrelandgraf/covid-stats-ssml)
