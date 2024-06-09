import { IncomingMessage, ServerResponse, request } from "http";
import { ICentralizedMemoryStore, IServerData } from "../interfaces";
import { CacheStaticKeys } from "../constants";

export async function handleRequests(input: {
  req: IncomingMessage;
  res: ServerResponse;
  memoryStore: ICentralizedMemoryStore;
}) {
  const { req, res, memoryStore } = input;

  try {
    const healthServers = await memoryStore.get<IServerData[]>(
      CacheStaticKeys.HEALTH_SERVERS_DATA
    );

    if (!healthServers?.length) {
      res.writeHead(500);
      res.end("Internal Server Error: No healthy servers available.");
      console.error("No healthy servers found in memory store.");
      return;
    }

    const randomIndex = Math.floor(Math.random() * healthServers.length);
    const server = healthServers[randomIndex];

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
