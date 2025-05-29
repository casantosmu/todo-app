import { setupWorker } from "msw/browser";
import { todoHandlers } from "../modules/todos/mocks";

const worker = setupWorker(...todoHandlers);

export const enableMocking = async () => {
  // @ts-expect-error this runs on nodeJS
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  await worker.start();
};
