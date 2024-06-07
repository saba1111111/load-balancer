import { IncomingMessage, ServerResponse } from "http";
import { getSsLKeys } from "./get-ssl-keys.helper";
import * as https from "https";

export function CreateHttpsServer(
  requestHandler: (req: IncomingMessage, res: ServerResponse) => void
) {
  const SSL_KEYS = getSsLKeys();
  const SERVER = https.createServer(SSL_KEYS, requestHandler);

  SERVER.keepAliveTimeout = 10 * 1000;
  SERVER.timeout = 60 * 1000;

  return SERVER;
}
