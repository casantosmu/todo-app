import fastifyPlugin from "fastify-plugin";
import SyncService from "../services/sync-service.js";

declare module "fastify" {
  export interface FastifyInstance {
    syncService: SyncService;
  }
}

/**
 * This plugin instantiates and decorates the Fastify instance
 * with all the application services.
 */
export default fastifyPlugin((server, options, done) => {
  const syncService = new SyncService(server.db);

  server.decorate("syncService", syncService);
  done();
});
