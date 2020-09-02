// this is a demo server //
import React from 'react';
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';

import ReactSMML, {
  Conversation,
  Document,
  Node,
  withRaw,
  withAoG,
} from './src';
import App from './demo/App';

const app = express();

// configure express middlewares
// helmet first
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// this is the default setting, you don't have to do this in your app
Conversation.useBuilder(withRaw);
// but you can create your own builders or select a set of builders from this package
// add the AoG builder to parse Actions on Google (Dialogflow) requests to the conversation model
Conversation.useBuilder(withAoG);

app.post('/hello-world', async (req, res) => {
  const HelloComponent = () => <>Hello World!</>;
  const ssmlDocument = new Document();
  ReactSMML.render(<HelloComponent />, ssmlDocument.body);
  res.status(200).json({ ssml: ssmlDocument.toString() });
});

app.post('/advanced', async (req, res) => {
  // parse request to conversation model
  const conv = new Conversation(req.body);

  // create document without defaultRoot or xmlDeclaration
  const ssmlDocument = new Document(conv.locale, false, false);
  // instead we create our own simple speak root node
  const root = new Node('speak');
  ssmlDocument.body = root;

  // we pass the conversation model and the document to our app so we can access it as props
  ReactSMML.render(<App conv={conv} doc={ssmlDocument} />, root);

  // will print the inital ssmlDocument tree
  console.log('initial', ssmlDocument);
  // will print the ssml string
  console.log(ssmlDocument.toString());

  let hasBeenSent = false;

  const sendToUser = message => {
    if (hasBeenSent) {
      console.log('document has already been sent');
      return;
    }
    hasBeenSent = true;
    console.log(message, ssmlDocument);
    const reply = ssmlDocument.toString();
    console.log(reply);
    res.status(200).json(conv.buildPayload(reply));
  };

  // timeout case: in voice conversations it's important to not let the user wait for too long
  // if we still render our app in 5 seconds, we return the current state to the user
  const timeout = setTimeout(() => sendToUser('sent after 5000ms'), 5000);

  // within our react app we can resolve isReady to return when ready
  // if timeout has happened before, we will not send the results to our user
  await ssmlDocument.isReady;
  clearTimeout(timeout);
  sendToUser('sent after document resolved to isReady');
});

app.listen(8888, () =>
  console.log('Express backend listening on port 8888! 🚀')
);
