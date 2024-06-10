import { CacheStaticKeys } from "../constants";
import {
  ICachedHealthServersData,
  ICachedServerData,
  IGetNextServerInput,
  IKeepOnlyHealthServersInput,
  IServerData,
} from "../interfaces";
import axios, { AxiosResponse } from "axios";
import { getInitialLoadBalancerState } from "./load-balancer-state.service";

export async function getNextServer(input: IGetNextServerInput) {
  const { memoryStore, loadBalancingAlgorithm } = input;

  const healthServersData = await memoryStore.get<ICachedHealthServersData>(
    CacheStaticKeys.HEALTH_SERVERS_DATA
  );

  if (!healthServersData) {
    throw new Error("No servers available");
  }

  const healthServers = healthServersData.healthServers;
  const loadBalancerState = healthServersData.loadBalancerState;

  const server = loadBalancingAlgorithm(healthServers, loadBalancerState);

  if (server) {
    await memoryStore.add<ICachedHealthServersData>(
      CacheStaticKeys.HEALTH_SERVERS_DATA,
      healthServersData
    );
  }

  return server;
}

export async function keepOnlyHealthServers(
  input: IKeepOnlyHealthServersInput
) {
  const { servers, memoryStore } = input;

  const healthServers = await getHealthServers(servers);

  const previouslyCachedHealthServersData =
    await memoryStore.get<ICachedHealthServersData>(
      CacheStaticKeys.HEALTH_SERVERS_DATA
    );

  if (previouslyCachedHealthServersData) {
    if (
      areServersIdentical(
        healthServers,
        previouslyCachedHealthServersData.healthServers
      )
    ) {
      return healthServers;
    }
  }

  const cachedHealthServersData: ICachedHealthServersData = {
    healthServers,
    loadBalancerState: getInitialLoadBalancerState(healthServers),
  };

  memoryStore.add<ICachedHealthServersData>(
    CacheStaticKeys.HEALTH_SERVERS_DATA,
    cachedHealthServersData
  );

  if (healthServers.length === 0) {
    console.warn("No healthy servers found.");
  }

  return healthServers;
}

async function getHealthServers(servers: IServerData[]) {
  const healthCheckPromises: Promise<AxiosResponse<string>>[] = servers.map(
    (server) => {
      const healthCheckUrl = `http://${server.host}:${server.port}/health-check`;
      return axios.get(healthCheckUrl);
    }
  );

  const healthCheckResponses = await Promise.allSettled(healthCheckPromises);
  const healthServers: ICachedServerData[] = [];

  healthCheckResponses.forEach((response, index) => {
    if (response.status === "fulfilled") {
      const server = servers[index];
      healthServers.push({
        id: `${server.host}-${server.port}`,
        ...server,
      });
    }
  });

  return healthServers;
}

function areServersIdentical(
  newServers: ICachedServerData[],
  oldServers: ICachedServerData[]
): boolean {
  if (newServers.length !== oldServers.length) {
    return false;
  }

  const serverIds1 = newServers.map((server) => server.id).sort();
  const serverIds2 = oldServers.map((server) => server.id).sort();

  return serverIds1.every((id, index) => id === serverIds2[index]);
}
