import { TLoadBalancingAlgorithm } from "../types";
import { ICentralizedMemoryStore } from "./centralized-memory-store.interface";

export interface IGetNextServerInput {
  memoryStore: ICentralizedMemoryStore;
  loadBalancingAlgorithm: TLoadBalancingAlgorithm;
}
