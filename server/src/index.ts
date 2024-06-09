import { createServer, IncomingMessage, ServerResponse } from "http";

const SERVER_NAME = process.env.SERVER_NAME;

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  if (req.url === "/health-check" && req.method === "GET") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end(`OK.`);
  } else {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end(`Hello from ${SERVER_NAME}.`);
  }
});

const PORT = process.env.PORT;

server.keepAliveTimeout = 10 * 1000;
server.timeout = 60 * 1000;

server.listen(PORT, () => {
  console.log(`${SERVER_NAME} is running at http://localhost:${PORT}.`);
});
