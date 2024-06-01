import { createServer, IncomingMessage, ServerResponse, request } from "http";
import dotenv from "dotenv";
import { ENVS, SERVERS } from "./constants";

dotenv.config();

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
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
});

const PORT = ENVS.LOAD_BALANCER.PORT;
const SERVER_NAME = ENVS.LOAD_BALANCER.SERVER_NAME;
server.listen(PORT, () => {
  console.log(`${SERVER_NAME} is running at http://localhost:${PORT}.`);
});
