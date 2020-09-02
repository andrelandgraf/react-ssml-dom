import React from 'react';

import { conversationType, documentType } from '../src';
import Weather from './Weather';

const routes = [
  {
    intent: 'WELCOME_INTENT',
    component: () => 'Welcome, how can I help you today?',
  },
  {
    intent: 'WEATHER',
    component: Weather,
  },
];

const App = ({ conv, doc }) => {
  const route = routes.find(r => r.intent === conv.intent);
  if (!route) {
    // endConversation default is true
    conv.response.endConversation = true;
    return "I am very sorry, I can't help with that.";
  }
  return <route.component doc={doc} />;
};

App.propTypes = {
  conv: conversationType,
  doc: documentType,
};

export default App;
