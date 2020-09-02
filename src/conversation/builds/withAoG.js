const target = 'aog';

const canBuildConversation = request => {
  const { originalDetectIntentRequest } = request;
  return (
    originalDetectIntentRequest &&
    originalDetectIntentRequest.source === 'google'
  );
};

const buildConversation = (request, map) => {
  const { queryResult, session, originalDetectIntentRequest } = request;
  const { payload } = originalDetectIntentRequest;
  const { user } = payload;
  const {
    intent: { displayName },
    parameters = {},
    queryText,
  } = queryResult;
  return {
    orginalRequest: request,
    target,
    user,
    locale: user.locale,
    session,
    intent: displayName,
    queryText,
    parameters: Object.entries(parameters).reduce((obj, [key, value]) => {
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
    }, {}),
  };
};

const buildPayload = conversation => ({
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

const withAoG = {
  target,
  canBuildConversation,
  buildConversation,
  buildPayload,
};

export default withAoG;
