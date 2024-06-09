import { CacheStaticKeys } from "../constants";
import { IKeepOnlyHealthServersInput, IServerData } from "../interfaces";
import axios, { AxiosResponse } from "axios";

export async function keepOnlyHealthServers(
  input: IKeepOnlyHealthServersInput
) {
  const { servers, memoryStore } = input;

  const healthCheckPromises: Promise<AxiosResponse<string>>[] = servers.map(
    (server) => {
      const healthCheckUrl = `http://${server.host}:${server.port}/health-check`;
      return axios.get(healthCheckUrl);
    }
  );

  const healthCheckResponses = await Promise.allSettled(healthCheckPromises);

  const healthyServers: IServerData[] = healthCheckResponses
    .filter(
      (response) =>
        response.status === "fulfilled" && response.value.status === 200
    )
    .map((response, index) => servers[index]);

  memoryStore.add("servers", healthyServers);

  if (healthyServers.length === 0) {
    console.warn("No healthy servers found.");
  }

  return healthyServers;
}
