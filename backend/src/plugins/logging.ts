import type { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import crypto from "node:crypto";

const CORRELATION_ID_HEADER = "x-correlation-id";

/**
 * This plugin enhances the logger to include a correlation ID for tracing.
 */
export default fastifyPlugin((server: FastifyInstance, options, done) => {
  server.addHook("onRequest", (request, reply, done) => {
    let correlationId = request.headers[CORRELATION_ID_HEADER];
    if (!correlationId || typeof correlationId !== "string") {
      correlationId = crypto.randomUUID();
    }

    request.log = server.log.child({ correlationId });
    reply.header(CORRELATION_ID_HEADER, correlationId);

    done();
  });

  server.addHook("onRequest", (request, reply, done) => {
    request.log.debug(
      {
        method: request.method,
        url: request.url,
      },
      "Incoming request",
    );

    done();
  });

  server.addHook("onResponse", (request, reply, done) => {
    server.log.debug(
      {
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        responseTime: reply.elapsedTime,
      },
      "Request completed",
    );

    done();
  });

  server.addHook("onError", (request, reply, error, done) => {
    request.log.error(
      {
        method: request.method,
        url: request.url,
        error: {
          message: error.message,
          stack: error.stack,
        },
      },
      "Request error",
    );

    done();
  });

  done();
});
