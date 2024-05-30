import { createServer, IncomingMessage, ServerResponse } from "http";
import dotenv from "dotenv";
import { ENVS } from "./constants";

dotenv.config();

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello, TypeScript with Node.js!");
});

const PORT = process.env[ENVS.PORT];
const SERVER_NAME = process.env[ENVS.SERVER_NAME];
server.listen(PORT, () => {
  console.log(`${SERVER_NAME} is running at http://localhost:${PORT}.`);
});
