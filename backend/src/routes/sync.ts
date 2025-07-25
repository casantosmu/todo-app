import type { FastifyPluginCallbackTypebox } from "@fastify/type-provider-typebox";
import { SyncBodySchema, SyncResponseSchema } from "../schemas/sync.js";

const syncRoute: FastifyPluginCallbackTypebox = (server, options, done) => {
  server.post(
    "/v1/sync",
    {
      schema: {
        body: SyncBodySchema,
        response: {
          200: SyncResponseSchema,
        },
      },
    },
    () => {
      return {
        newSyncToken: 0,
        changes: [],
      };
    },
  );

  done();
};

export default syncRoute;
