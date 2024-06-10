import { calculateGcdOfTwoNumbers } from "../helpers";
import {
  ICachedServerData,
  ILoadBalancerState,
  IServerData,
} from "../interfaces";
import { TLoadBalancingAlgorithm } from "../types";

function calculateGcdOfServersWeights(servers: IServerData[]) {
  let result = servers[0].weight;
  for (let i = 1; i < servers.length; i++) {
    result = calculateGcdOfTwoNumbers(result, servers[i].weight);
  }
  return result;
}

export function getInitialLoadBalancerState(servers: IServerData[]) {
  const maxWeight = Math.max(...servers.map((server) => server.weight));
  const gcdOfServersWeights = calculateGcdOfServersWeights(servers);

  return {
    currentServerIndex: -1,
    currentWeight: 0,
    gcdValue: gcdOfServersWeights,
    maxWeight,
  };
}

export const weighedRoundRobinAlgorithm: TLoadBalancingAlgorithm = (
  healthServers: ICachedServerData[],
  loadBalancerState: ILoadBalancerState
) => {
  while (true) {
    loadBalancerState.currentServerIndex =
      (loadBalancerState.currentServerIndex + 1) % healthServers.length;

    if (loadBalancerState.currentServerIndex === 0) {
      loadBalancerState.currentWeight =
        loadBalancerState.currentWeight - loadBalancerState.gcdValue;

      if (loadBalancerState.currentWeight <= 0) {
        loadBalancerState.currentWeight = loadBalancerState.maxWeight;

        if (loadBalancerState.currentWeight === 0) {
          return null;
        }
      }
    }

    if (
      healthServers[loadBalancerState.currentServerIndex].weight >=
      loadBalancerState.currentWeight
    ) {
      return healthServers[loadBalancerState.currentServerIndex];
    }
  }
};
