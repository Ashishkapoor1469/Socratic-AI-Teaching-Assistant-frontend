FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./
RUN pnpm install && pnpm store prune

COPY prisma ./prisma
COPY prisma.config.ts ./          
RUN pnpm prisma generate

COPY tsconfig*.json nest-cli.json ./
COPY src ./src
RUN pnpm build

# ---- Runner ----
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

RUN echo "enable-pre-post-scripts=true" >> .npmrc && \
    echo "ignore-scripts=false" >> .npmrc

RUN pnpm install --production && pnpm store prune

COPY --from=builder /app/dist ./dist


COPY --from=builder /app/generated ./generated

COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/src/main"]