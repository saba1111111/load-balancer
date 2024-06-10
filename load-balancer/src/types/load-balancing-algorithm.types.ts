import { ICachedServerData, ILoadBalancerState } from "../interfaces";

export type TLoadBalancingAlgorithm = (
  healthServers: ICachedServerData[],
  loadBalancerState: ILoadBalancerState
) => ICachedServerData | null;
