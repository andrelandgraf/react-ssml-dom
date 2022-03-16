import React from 'react';
import Error from './Error.server';

const shouldActAs = 'success';

const fetchWeatherData = () => {
    throw new Promise(resolve => {
        setTimeout(
            () =>
                shouldActAs === 'error'
                    ? resolve({ error: 'internal' })
                    : shouldActAs === 'success'
                    ? resolve({ error: 'timeout' })
                    : resolve({ weather: 'sunny' }),
            3000,
        );
    });
};

const Weather = () => {
    const forecast = fetchWeatherData();

    if (forecast.error) {
        return forecast.error === 'timeout' ? 'We are sorry. This took too long.' : <Error />;
    } else {
        return `The forecast for today's weather is ${forecast.weather}`;
    }
};

export default Weather;
