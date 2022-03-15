import React from 'react';
import Weather from './Weather';

const routes = [
    {
        intent: 'WELCOME_INTENT',
        Component: () => 'Welcome, how can I help you today?',
    },
    {
        intent: 'WEATHER',
        Component: Weather,
    },
];

const App = ({ intent }) => {
    const route = routes.find(r => r.intent === intent);
    if (!route) {
        return "I am very sorry, I can't help with that.";
    }
    return <route.Component />;
};

export default App;
