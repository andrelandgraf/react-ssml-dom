// this is a demo server //
import React from 'react';
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';

import ReactSMML, { Document, Node } from '../dist';
import App from './App';

const app = express();

// configure express middlewares
// helmet first
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function sendReply(req, res, ssml) {
    const accept = req.headers.accept;
    if (accept == 'application/ssml+xml') {
        res.setHeader('Content-Type', 'application/ssml+xml');
        res.status(200).send(ssml);
    } else {
        res.status(200).json({ ssml });
    }
}

app.post('/hello-world', async (req, res) => {
    const HelloComponent = () => <>Hello World!</>;
    const ssmlDocument = new Document();
    ReactSMML.render(<HelloComponent />, ssmlDocument.body);
    const ssml = ssmlDocument.toString();
    sendReply(req, res, ssml);
});

app.post('/advanced', async (req, res) => {
    const { intent } = req.body;
    // create document without defaultRoot or xmlDeclaration
    const ssmlDocument = new Document('en-US', false, false);
    // instead we create our own simple speak root node
    const root = new Node('speak');
    ssmlDocument.body = root;

    // we pass the conversation model and the document to our app so we can access it as props
    ReactSMML.render(<App intent={intent || 'WELCOME_INTENT'} />, root);

    // will print the ssmlDocument tree
    console.log('initial', ssmlDocument);

    const ssml = ssmlDocument.toString();
    // will print the ssml string
    console.log(ssml);

    sendReply(req, res, ssml);
});

app.listen(8888, () => console.log('Express backend listening on port 8888! 🚀'));
