import type { FastifyPluginCallbackTypebox } from "@fastify/type-provider-typebox";
import SyncTaskHandler from "../handlers/sync-task-handler.js";
import SyncLogRepository from "../repositories/sync-log-repository.js";
import TaskRepository from "../repositories/task-repository.js";
import { SyncRequestSchema, SyncResponseSchema } from "../schemas/sync.js";
import SyncService from "../services/sync-service.js";

const syncRoute: FastifyPluginCallbackTypebox = (server, options, done) => {
  const taskRepo = new TaskRepository(server.db);
  const syncLogRepo = new SyncLogRepository(server.db);
  const syncTaskHandler = new SyncTaskHandler(taskRepo);
  const syncService = new SyncService(server.db, syncLogRepo, syncTaskHandler);

  server.post(
    "/",
    {
      schema: {
        body: SyncRequestSchema,
        response: {
          200: SyncResponseSchema,
        },
      },
    },
    (request) => {
      return syncService.sync(request.body);
    },
  );

  done();
};

export default syncRoute;
