import { ENVS } from "./envs.constants";

export const SERVERS = [
  { host: ENVS.FIRST_SERVER.SERVER_NAME, port: ENVS.FIRST_SERVER.PORT },
  { host: ENVS.SECOND_SERVER.SERVER_NAME, port: ENVS.SECOND_SERVER.PORT },
  { host: ENVS.THIRD_SERVER.SERVER_NAME, port: ENVS.THIRD_SERVER.PORT },
];
