type ParseMap = Record<string, any>;
type Request = Record<string, any>;

interface ConvData {
  orginalRequest: Request;
  intent: string;
  parameters: Record<string, any>;
  target: string;
  locale: string;
  queryText?: string;
  sessionId?: string;
}

type CanHandle = (request: Request) => boolean;
type ParseRequest = (request: Request, map?: Record<string, any>) => ConvData;
type BuildResponse = (conversation: Request, map?: Record<string, any>) => Record<string, any>;

interface Adapter {
  target: string;
  canHandle: CanHandle;
  parseRequest: ParseRequest;
  buildResponse: BuildResponse;
}

type Response = {
  reply: string;
  contexts: Array<Record<string, any>>;
  endConversation: boolean;
};

type AdapterWithMap = { adapter: Adapter; map?: ParseMap };

export type { ConvData, Adapter, CanHandle, ParseRequest, Response, BuildResponse, ParseMap, AdapterWithMap };
