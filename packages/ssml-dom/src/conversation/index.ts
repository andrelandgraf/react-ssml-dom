import type { Response, ParseMap, Adapter, AdapterWithMap } from './types';
import { SimpleJSON } from './adapters';

class Conversation {
  locale = 'en-US';
  request: Record<string, unknown>;
  parameters: Record<string, unknown> = {};
  intent: string | undefined = undefined;
  sessionId: string | undefined = undefined;
  queryText: string | undefined = undefined;
  response: Response = {
    reply: '',
    contexts: [],
    endConversation: true,
  };

  adapter: AdapterWithMap | null = null;
  adapters: Array<AdapterWithMap> = [{ adapter: SimpleJSON, map: {} }];

  useAdapter(adapter: Adapter, map: ParseMap = {}): this {
    if (!this.adapters.find((a) => a.adapter === adapter)) {
      this.adapters.push({ adapter, map });
    }
    return this;
  }

  constructor(request: Record<string, unknown>) {
    this.request = request;
    this.handleRequest(request);
  }

  canHandleRequest(request: Record<string, unknown>): boolean {
    return !!this.adapters.find(({ adapter }) => adapter.canHandle(request));
  }

  handleRequest(request: Record<string, unknown>): void {
    this.request = request || this.request;
    const targetAdapter = this.adapters.find(({ adapter }) => adapter.canHandle(request));
    if (!targetAdapter) {
      throw Error('request does not fit any adapter');
    }
    this.adapter = targetAdapter;
    const { adapter, map } = targetAdapter;
    const {
      locale = this.locale,
      intent = this.intent,
      parameters = this.parameters,
      queryText = this.queryText,
      sessionId = this.sessionId,
    } = adapter.parseRequest(request, map);
    this.locale = locale;
    this.intent = intent;
    this.parameters = parameters;
    this.queryText = queryText;
    this.sessionId = sessionId;
  }

  buildPayload(reply: string): Record<string, any> {
    if (!this.adapter) {
      if (this.adapters.length === 1) {
        this.adapter = this.adapters[0];
      } else {
        throw Error('no request has been specified');
      }
    }
    if (reply) {
      this.response.reply = reply;
    }
    const { adapter, map } = this.adapter;
    return adapter.buildResponse(this, map);
  }

  getParameter = (key: string) => (this.parameters ? this.parameters[key] : undefined);
}

export * from './adapters';
export * from './types';
export { Conversation };
