FROM node:22 AS frontend
WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

FROM golang:1.25-alpine AS backend
WORKDIR /app

RUN apk add --no-cache gcc musl-dev

COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend/ ./

RUN CGO_ENABLED=1 go build -ldflags='-s' -o ./bin/todo-app ./cmd/api

FROM alpine:3.22
WORKDIR /app

RUN apk add --no-cache tzdata

COPY --from=backend /app ./
COPY --from=frontend /app/dist ./ui

EXPOSE 3000

CMD ["./bin/todo-app"]
