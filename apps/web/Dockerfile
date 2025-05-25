FROM node:18-alpine AS base

ARG NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
ARG NEXT_PUBLIC_SUBSCRIPTIONS_ENDPOINT=ws://localhost:4000/graphql/ws

ENV HOSTNAME="0.0.0.0"
ENV PORT="3000"
ENV NEXT_PUBLIC_GRAPHQL_ENDPOINT=$NEXT_PUBLIC_GRAPHQL_ENDPOINT
ENV NEXT_PUBLIC_SUBSCRIPTIONS_ENDPOINT=${NEXT_PUBLIC_SUBSCRIPTIONS_ENDPOINT}
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable


FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /app

RUN pnpm install turbo --global
COPY . .

RUN turbo prune @woovi-playground/web --docker

FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=builder /app/out/json .
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full .
RUN pnpm turbo run build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs


COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
