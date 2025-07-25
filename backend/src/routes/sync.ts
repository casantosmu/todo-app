import type { FastifyInstance, FastifyPluginOptions } from "fastify";

export default function syncRoute(
  server: FastifyInstance,
  options: FastifyPluginOptions,
  done: (err?: Error) => void,
) {
  server.get("/", () => {
    return server.syncService.helloWorld();
  });

  done();
}
