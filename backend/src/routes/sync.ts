import {
  Type,
  type FastifyPluginCallbackTypebox,
} from "@fastify/type-provider-typebox";
import SyncTaskHandler from "../handlers/sync-task-handler.js";
import SyncLogRepository from "../repositories/sync-log-repository.js";
import TaskRepository from "../repositories/task-repository.js";
import { SyncRequestSchema, SyncResponseSchema } from "../schemas/sync.js";
import SyncService from "../services/sync-service.js";

const syncRoute: FastifyPluginCallbackTypebox = (server, options, done) => {
  const taskRepo = new TaskRepository(server.db);
  const syncLogRepo = new SyncLogRepository(server.db);

  server.post(
    "/",
    {
      schema: {
        body: SyncRequestSchema,
        response: {
          200: SyncResponseSchema,
          500: Type.Object({
            message: Type.String(),
          }),
        },
      },
    },
    (request, reply) => {
      try {
        const syncService = new SyncService(
          request.log,
          server.db,
          syncLogRepo,
          new SyncTaskHandler(request.log, taskRepo),
        );

        const result = syncService.sync(request.body);

        reply.status(200).send(result);
      } catch (error) {
        request.log.error(error, "Sync error");
        reply.status(500).send({ message: "Sync error" });
      }
    },
  );

  done();
};

export default syncRoute;
