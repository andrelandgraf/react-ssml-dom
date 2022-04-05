import type { Adapter, CanHandle, ParseRequest, BuildResponse } from '../types';

const target = 'Simple JSON (default)';

const canHandle: CanHandle = (request) => {
  const { intent } = request;
  return !!intent;
};

const parseRequest: ParseRequest = (request) => {
  const { intent, parameters, user, queryText, sessionId, locale = 'en-US' } = request;
  return {
    orginalRequest: request,
    intent,
    parameters: parameters || {},
    target,
    locale,
    user,
    queryText,
    sessionId,
  };
};

const buildResponse: BuildResponse = (conversation) => ({
  ...conversation.response,
});

const SimpleJSON: Adapter = {
  target,
  canHandle,
  parseRequest,
  buildResponse,
};

export { SimpleJSON };
