import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "kcors";
import { graphqlHTTP } from "koa-graphql";
import Router from "koa-router";
import logger from "koa-logger";

import { schema } from "../schema/schema";
import { getContext } from "./getContext";
import { createWebsocketMiddleware } from "./websocketMiddleware";
import { getBucket, updateBucket } from "./rateLimiter";

const app = new Koa();
app.use(cors({ origin: "*" }));
app.use(logger());
app.use(
  bodyParser({
    onerror(err, ctx) {
      ctx.throw(err, 422);
    },
  }),
);

app.use(async (ctx, next) => {
  if (ctx.request.url === "/health" && ctx.request.method === "GET") {
    ctx.status = 200;
    ctx.body = "Ok";

    return;
  }

  const apiKey = ctx.headers["x-api-key"] as string;

  if (!apiKey) {
    ctx.status = 401;
    ctx.body = { error: "API key is required" };
    return;
  }

  const { tokens, lastUpdated } = await getBucket(apiKey);

  if (tokens < 1) {
    ctx.status = 429;
    ctx.body = { error: "Rate limit exceeded" };
    return;
  }

  ctx.state.apiKey = apiKey;
  ctx.state.tokens = tokens;
  ctx.state.lastUpdated = lastUpdated;

  await next();
});
app.use(createWebsocketMiddleware());

const routes = new Router();

routes.all(
  "/graphql",
  graphqlHTTP((req, res, ctx) => ({
    schema,
    graphiql: true,
    context: getContext(),
    customFormatErrorFn(error) {
      const { apiKey, tokens, lastUpdated } = ctx.state;
      updateBucket(apiKey, Math.max(0, tokens - 1), lastUpdated);

      return {
        message: error.message,
        code: error.extensions?.code || "INTERNAL_SERVER_ERROR",
        path: error.path,
      };
    },
  })),
);

app.use(routes.routes());
app.use(routes.allowedMethods());

export { app };
