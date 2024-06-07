import { ENVS } from "../constants";
import { ICentralizedMemoryStore } from "../interfaces";
import Redis from "ioredis";

export class RedisStore implements ICentralizedMemoryStore {
  private redisClient: Redis | null;

  public constructor() {
    this.redisClient = new Redis({
      host: ENVS.REDIS.SERVER_NAME,
      port: Number(ENVS.REDIS.PORT),
    });

    this.redisClient.on("error", (error) => {
      this.redisClient = null;
      console.log(`Failed connection to redis: ${error.message}!`);
    });

    this.redisClient.on("connect", () => {
      console.log("Successfully connect redis!");
    });
  }

  private getClient(): Redis {
    if (!this.redisClient) {
      throw new Error("Redis client is not connected");
    }
    return this.redisClient;
  }

  public async add<T>(key: string, value: T): Promise<"OK">;
  public async add<T>(key: string, value: T, expiration: number): Promise<"OK">;
  public async add<T>(key: string, value: T, expiration?: number) {
    const client = this.getClient();
    const stringifyValue = JSON.stringify(value);

    if (expiration !== undefined && expiration > 0) {
      return client.set(key, stringifyValue, "EX", expiration);
    } else {
      return client.set(key, stringifyValue);
    }
  }

  public async get<T>(key: string): Promise<T | null> {
    const client = this.getClient();
    const data = await client.get(key);
    const parsedData = data ? (JSON.parse(data) as T) : null;

    return parsedData;
  }

  public remove(key: string): Promise<number> {
    const client = this.getClient();
    return client.del(key);
  }
}
