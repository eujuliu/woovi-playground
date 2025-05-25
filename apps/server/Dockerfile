FROM node:18-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ENV PORT=4000
ENV MONGO_URI="mongodb://localhost/woovi-playground?replicaSet=rs0"
ENV REDIS_HOST="redis://localhost"
ENV NODE_ENV="development"

RUN corepack enable

FROM base AS builder

WORKDIR /app

RUN pnpm install turbo --global
COPY . .

RUN turbo prune @woovi-playground/server --docker

FROM base AS installer
WORKDIR /app

COPY --from=builder /app/out/json .
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full .
RUN pnpm turbo run build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 koajs
USER koajs

COPY --from=installer --chown=koajs:nodejs /app/apps/server/dist ./
COPY --from=installer --chown=koajs:nodejs /app/node_modules ./node_modules

EXPOSE 4000

CMD ["node", "src/index.js"]
