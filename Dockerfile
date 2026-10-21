FROM golang:alpine AS backend-builder
WORKDIR /app/backend

COPY backend/go.mod ./
RUN go mod download

COPY backend/ .
RUN CGO_ENABLED=0 GOOS=linux go build -o calculator-api .

FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend

RUN corepack enable pnpm
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY frontend/ .
RUN pnpm run build

FROM alpine:latest
WORKDIR /app

RUN apk add --no-cache busybox-extras

COPY --from=backend-builder /app/backend/calculator-api .

COPY --from=frontend-builder /app/frontend/dist ./dist

EXPOSE 80 8080

CMD ["sh", "-c", "./calculator-api & httpd -f -p 80 -h /app/dist"]