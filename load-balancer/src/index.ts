import { IncomingMessage, ServerResponse, request } from "http";
import dotenv from "dotenv";
import { ENVS, SERVERS } from "./constants";
import cluster from "cluster";
import os from "os";
import { CreateHttpsServer } from "./helpers/create-server.helper";
import { RedisStore } from "./configurations";
import { keepOnlyHealthServers } from "./helpers";

dotenv.config();

const centralizedMemoryStore = new RedisStore();

const NUMBER_OF_CPU_CORES = os.cpus().length;
const SERVER_NAME = ENVS.LOAD_BALANCER.SERVER_NAME;

if (cluster.isPrimary) {
  console.log(`${SERVER_NAME}: Master ${process.pid} is running`);

  for (let i = 0; i < NUMBER_OF_CPU_CORES; i++) {
    cluster.fork();
  }

  (async () => {
    await keepOnlyHealthServers({
      memoryStore: centralizedMemoryStore,
      servers: SERVERS,
    });

    setInterval(async () => {
      await keepOnlyHealthServers({
        memoryStore: centralizedMemoryStore,
        servers: SERVERS,
      });
    }, 90 * 1000);
  })();

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died.`);
    cluster.fork();
  });
} else {
  const requestHandler = (req: IncomingMessage, res: ServerResponse) => {
    const server = SERVERS[0];
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
      res.writeHead(500);
      res.end("Internal Server Error.");
    });

    req.pipe(proxy, { end: true });
  };

  const server = CreateHttpsServer(requestHandler);

  const PORT = ENVS.LOAD_BALANCER.PORT;
  server.listen(PORT, () => {
    console.log(
      `${SERVER_NAME}: Worker ${process.pid} is running at http://localhost:${PORT}.`
    );
  });
}
