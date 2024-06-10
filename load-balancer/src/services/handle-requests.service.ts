import { request } from "http";
import { IHandleRequestInput } from "../interfaces";
import { getNextServer } from "./manage-servers.service";
import { weighedRoundRobinAlgorithm } from "./load-balancer-state.service";

export async function handleRequests(input: IHandleRequestInput) {
  const { req, res, memoryStore } = input;

  try {
    const server = await getNextServer({
      memoryStore,
      loadBalancingAlgorithm: weighedRoundRobinAlgorithm,
    });

    if (!server) {
      res.writeHead(500);
      res.end("Internal Server Error: No healthy servers available.");
      console.error("No healthy servers found in memory store.");
      return;
    }

    const options = {
      host: server.host,
      port: server.port,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxy = request(options, (response) => {
      const statusCode = response.statusCode ?? 500;
      res.writeHead(statusCode, response.headers);
      response.pipe(res, { end: true });
    });

    proxy.on("error", (err) => {
      console.error("Proxy error:", err);
      res.writeHead(500);
      res.end("Internal Server Error.");
    });

    req.pipe(proxy, { end: true });
  } catch (err) {
    console.error("Error handling request:", err);
    res.writeHead(500);
    res.end("Internal Server Error.");
  }
}
