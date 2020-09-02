import PropTypes from 'prop-types';

import withRaw from './builds/withRaw';

export default class Conversation {
  locale = 'en-US';

  intent;

  target;

  parameters = {};

  originalRequest;

  user;

  queryText;

  sessionId;

  response = {
    reply: '',
    contexts: [],
    endConversation: true,
  };

  static builders = [{ builder: withRaw, map: {} }];

  static useBuilder(builder, map = {}) {
    Conversation.builders.push({ builder, map });
  }

  constructor(request) {
    const suitableBuilder = Conversation.builders.find(({ builder: b }) =>
      b.canBuildConversation(request)
    );
    if (!suitableBuilder) {
      throw Error('request does not fit any builder');
    }
    const { builder, map } = suitableBuilder;
    const {
      locale = this.locale,
      intent = this.intent,
      target = suitableBuilder.target,
      parameters = this.parameters,
      originalRequest = this.originalRequest,
      user = this.user,
      queryText = this.queryText,
      sessionId = this.sessionId,
    } = builder.buildConversation(request, map);
    this.locale = locale;
    this.intent = intent;
    this.target = target;
    this.parameters = parameters;
    this.originalRequest = originalRequest;
    this.user = user;
    this.queryText = queryText;
    this.sessionId = sessionId;
  }

  buildPayload(reply) {
    if (reply) {
      this.response.reply = reply;
    }
    const suitableBuilder = Conversation.builders.find(
      ({ builder: b }) => b.target === this.target
    );
    if (!suitableBuilder) {
      throw Error('target does not fit any builder');
    }
    const { builder } = suitableBuilder;
    return builder.buildPayload(this);
  }

  getParameter = key => (this.parameters ? this.parameters[key] : undefined);
}

const conversationType = PropTypes.shape({
  locale: PropTypes.string,
  intent: PropTypes.string,
  target: PropTypes.string,
  parameters: PropTypes.object,
  originalRequest: PropTypes.object,
  user: PropTypes.object,
  queryText: PropTypes.string,
  sessionId: PropTypes.string,
  response: PropTypes.shape({
    reply: PropTypes.string,
    contexts: PropTypes.array,
    endConversation: PropTypes.bool,
  }),
  getParameter: PropTypes.func,
});

export { conversationType };
