import React from 'react';
import Error from './Error';
import Exercise from './Exercise';

const receivedError = false;

const Reply = () => {
  const [src, setSrc] = React.useState();
  const [status, setStatus] = React.useState('idle');

  React.useEffect(() => {
    if (status === 'idle') {
      setStatus('loading');
      setTimeout(() => {
        if (receivedError) {
          setStatus('error');
        } else {
          setSrc('https://s3-bucket.com/mock-song.ogg');
          setStatus('success');
        }
      }, 3000);
    }
    if (status === 'success') {
      console.log('after 3000 is ready to send');
      // eslint-disable-next-line no-undef
      ssmlDocument.setReady();
    }
  }, [status]);

  switch (status) {
    case 'error':
      return <Error />;
    case 'success':
      return <Exercise src={src} />;
    default:
      return 'It seems like we timed out';
  }
};

export default Reply;
