import * as fs from "fs";

export const getSsLKeys = () => ({
  key: fs.readFileSync("/etc/ssl/server.key"),
  cert: fs.readFileSync("/etc/ssl/server.cert"),
});
