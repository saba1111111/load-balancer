import { CacheStaticKeys } from "../constants";
import { calculateGcdOfTwoNumbers } from "../helpers";
import {
  ICachedHealthServersData,
  ICentralizedMemoryStore,
  IServerData,
} from "../interfaces";

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
    currentWeight: maxWeight,
    gcdValue: gcdOfServersWeights,
    maxWeight,
  };
}

async function getNextServer(input: { memoryStore: ICentralizedMemoryStore }) {
  const { memoryStore } = input;

  const healthServersData = await memoryStore.get<ICachedHealthServersData>(
    CacheStaticKeys.HEALTH_SERVERS_DATA
  );

  if (!healthServersData) {
    throw new Error("No servers available");
  }

  const healthServers = healthServersData.healthServers;
  const loadBalancerState = healthServersData.loadBalancerState;

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
      loadBalancerState.maxWeight
    ) {
      memoryStore.add<ICachedHealthServersData>(
        CacheStaticKeys.HEALTH_SERVERS_DATA,
        healthServersData
      );
      return healthServers[loadBalancerState.currentServerIndex];
    }
  }
}
