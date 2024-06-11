import { IncomingMessage, ServerResponse } from "http";
import dotenv from "dotenv";
import { ENVS, SERVERS } from "./constants";
import cluster from "cluster";
import os from "os";
import { RedisStore } from "./configurations";
import { keepOnlyHealthServers } from "./services/manage-servers.service";
import { getSsLKeys } from "./helpers";
import * as https from "https";
import { handleRequests } from "./services";

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
  const SSL_KEYS = getSsLKeys();
  const handleIncomingRequests = (req: IncomingMessage, res: ServerResponse) =>
    handleRequests({ req, res, memoryStore: centralizedMemoryStore });

  const SERVER = https.createServer(SSL_KEYS, handleIncomingRequests);

  SERVER.keepAliveTimeout = 10 * 1000;
  SERVER.timeout = 60 * 1000;

  const PORT = ENVS.LOAD_BALANCER.PORT;
  SERVER.listen(PORT, () => {
    console.log(
      `${SERVER_NAME}: Worker ${process.pid} is running at http://localhost:${PORT}.`
    );
  });
}
