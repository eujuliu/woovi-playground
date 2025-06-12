import path from "node:path";

import dotenvSafe from "dotenv-safe";
import type { SentinelAddress } from "ioredis";

const cwd = process.cwd();

const root = path.join.bind(cwd);

dotenvSafe.config({
  path: root(".env"),
  sample: root(".env.example"),
  allowEmptyValues: true,
});

const ENV = process.env;

const config = {
  PORT: ENV.PORT ?? 4000,
  MONGO_URI: ENV.MONGO_URI ?? "",
  NODE_ENV: ENV.NODE_ENV ?? "production",
  REDIS_HOST: ENV.REDIS_HOST ?? "",
  REDIS_PASSWORD: ENV.REDIS_PASSWORD,
  REDIS_USERNAME: ENV.REDIS_USERNAME,
  REDIS_SENTINEL: ENV.REDIS_SENTINEL?.split(",").map<Partial<SentinelAddress>>(
    (sentinel) => {
      const [host, port] = sentinel.split(":");

      return { host, port: Number(port) };
    },
  ),
  REDIS_SENTINEL_MASTER_NAME: ENV.REDIS_SENTINEL_MASTER_NAME ?? "mymaster",
};

export { config };
