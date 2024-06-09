export const ENVS = {
  LOAD_BALANCER: {
    PORT: process.env.LOAD_BALANCER_SERVER_PORT,
    SERVER_NAME: process.env.LOAD_BALANCER_SERVER_NAME,
  },
  FIRST_SERVER: {
    PORT: process.env.FIRST_SERVER_PORT,
    SERVER_NAME: process.env.FIRST_SERVER_NAME,
    SERVER_WEIGH: process.env.FIRST_SERVER_WEIGH,
  },
  SECOND_SERVER: {
    PORT: process.env.SECOND_SERVER_PORT,
    SERVER_NAME: process.env.SECOND_SERVER_NAME,
    SERVER_WEIGH: process.env.SECOND_SERVER_WEIGH,
  },
  THIRD_SERVER: {
    PORT: process.env.THIRD_SERVER_PORT,
    SERVER_NAME: process.env.THIRD_SERVER_NAME,
    SERVER_WEIGH: process.env.THIRD_SERVER_WEIGH,
  },
  REDIS: {
    PORT: process.env.REDIS_PORT || 6379,
    SERVER_NAME: process.env.REDIS_HOST || "localhost",
  },
};
