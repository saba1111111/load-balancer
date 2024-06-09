import { ICentralizedMemoryStore } from "./centralized-memory-store.interface";
import { IServerData } from "./servers-data.interface";

export interface IKeepOnlyHealthServersInput {
  servers: IServerData[];
  memoryStore: ICentralizedMemoryStore;
}
