import { IServerData } from "../interfaces";
import { ENVS } from "./envs.constants";

export const SERVERS: IServerData[] = [
  {
    host: ENVS.FIRST_SERVER.SERVER_NAME as string,
    port: Number(ENVS.FIRST_SERVER.PORT),
  },
  {
    host: ENVS.SECOND_SERVER.SERVER_NAME as string,
    port: Number(ENVS.SECOND_SERVER.PORT),
  },
  {
    host: ENVS.THIRD_SERVER.SERVER_NAME as string,
    port: Number(ENVS.THIRD_SERVER.PORT),
  },
];
