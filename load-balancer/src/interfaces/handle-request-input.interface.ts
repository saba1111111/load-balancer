import { IncomingMessage, ServerResponse } from "http";
import { ICentralizedMemoryStore } from "./centralized-memory-store.interface";

export interface IHandleRequestInput {
  req: IncomingMessage;
  res: ServerResponse;
  memoryStore: ICentralizedMemoryStore;
}
