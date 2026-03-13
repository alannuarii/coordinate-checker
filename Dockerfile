# ---- Base Node ----
FROM node:22-alpine AS base
WORKDIR /app
# Enable corepack for pnpm if needed, or use npm
# We'll stick to npm to match what we compiled with
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# ---- Dependencies ----
FROM base AS deps
RUN if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

# ---- Builder ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ARGs for variables needed during build
ARG VITE_GOOGLE_MAPS_API_KEY
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY

RUN npm run build

# ---- Runner ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# SolidStart/Nitro (with node-server preset) creates the server inside .output
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["node", ".output/server/index.mjs"]
