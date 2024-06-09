export interface IServerData {
  host: string;
  port: number;
  weight: number;
}

export interface ICachedServerData extends IServerData {
  id: string;
}
export interface ICachedHealthServersData {
  healthServers: ICachedServerData[];
  loadBalancerState: ILoadBalancerState;
}

export interface ILoadBalancerState {
  currentServerIndex: number;
  currentWeight: number;
  gcdValue: number;
  maxWeight: number;
}
