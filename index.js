// this is a demo server //
/* global ssmlDocument */
import React from 'react';
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';

import ReactSMML from './src/ReactSSML';
import { Document, Node } from './src/ssml-dom';
import App from './demo/App';

const app = express();

// configure express middlewares
// helmet first
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', async (req, res) => {
  global.ssmlDocument = new Document();
  const root = new Node('speak');
  ssmlDocument.body = root;

  ReactSMML.render(<App />, root);

  console.log('initial', ssmlDocument);
  console.log(ssmlDocument.toString());

  let hasBeenSent = false;
  const payload = {};

  const timeout = setTimeout(() => {
    console.log('after 5000', ssmlDocument);
    hasBeenSent = true;
    const reply = ssmlDocument.toString();
    payload.reply = reply;
    console.log(reply);
    res.json(payload);
  }, 5000);

  await ssmlDocument.isReady;
  if (hasBeenSent) {
    console.log('has already been sent');
  } else {
    clearTimeout(timeout);
    console.log('after isReady', ssmlDocument);
    hasBeenSent = true;
    const reply = ssmlDocument.toString();
    payload.reply = reply;
    console.log(reply);
    res.json(payload);
  }
});

app.listen(8888, () =>
  console.log('Express backend listening on port 8888! 🚀')
);
