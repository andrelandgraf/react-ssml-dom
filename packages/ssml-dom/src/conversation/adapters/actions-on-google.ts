import type { Adapter, CanHandle, ParseRequest, BuildResponse } from '../types';

const target = 'Actions on Google';

const canHandle: CanHandle = (request) => {
  const { originalDetectIntentRequest } = request;
  return originalDetectIntentRequest && originalDetectIntentRequest.source === 'google';
};

const parseRequest: ParseRequest = (request, map = {}) => {
  const { queryResult, session, originalDetectIntentRequest } = request;
  const { payload } = originalDetectIntentRequest;
  const { user } = payload;
  const {
    intent: { displayName },
    parameters = {},
    queryText,
  } = queryResult;

  const parsedParams: Record<string, any> = Object.entries(parameters).reduce((obj, [key, value]) => {
    if (!map.parameters || !map.parameters[key]) {
      obj[key] = value;
      return obj;
    }
    const resolver = map.parameters[key];
    if (typeof resolver === 'function') {
      obj[resolver(value)] = value;
      return obj;
    }
    obj[resolver] = value;
    return obj;
  }, {} as Record<string, any>);

  parsedParams.user = user;

  return {
    orginalRequest: request,
    target,
    locale: user.locale,
    session,
    intent: displayName,
    queryText,
    parameters: parsedParams,
  };
};

const buildResponse: BuildResponse = (conversation) => ({
  payload: {
    google: {
      expectUserResponse: !conversation.response.endConversation,
      richResponse: {
        items: [
          {
            simpleResponse: {
              textToSpeech: conversation.response.reply,
            },
          },
        ],
      },
    },
  },
});

const ActionsOnGoogle: Adapter = {
  target,
  canHandle,
  parseRequest,
  buildResponse,
};

export { ActionsOnGoogle };
