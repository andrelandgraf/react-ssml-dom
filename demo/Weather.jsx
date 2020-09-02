import React from 'react';

import { documentType } from '../src';
import Error from './Error';

const receivedError = false;

const fetchWeatherData = () =>
  new Promise(resolve => {
    setTimeout(
      () =>
        receivedError
          ? resolve({ error: 'error' })
          : resolve({ weather: 'sunny' }),
      3000
    );
  });

const Weather = ({ doc }) => {
  const [forecast, setForecast] = React.useState();
  const [status, setStatus] = React.useState('idle');

  // fetch
  React.useEffect(() => {
    if (status === 'idle') {
      setStatus('loading');

      const fetch = async () => {
        const { error, weather } = await fetchWeatherData();
        if (error) {
          setStatus('error');
        } else {
          setForecast(weather);
          setStatus('success');
        }
      };
      fetch();
    } else if (status === 'success') {
      // let's signal that the document is ready
      // will resolve the doc.isReady promise
      doc.setReady();
    }
  }, [doc, status]);

  switch (status) {
    case 'error':
      return <Error />;
    case 'success':
      return `The forecase for today's weather is ${forecast}`;
    default:
      return 'It seems like we timed out';
  }
};

Weather.propTypes = {
  doc: documentType,
};

export default Weather;
