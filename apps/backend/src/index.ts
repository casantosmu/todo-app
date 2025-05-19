import express from "express";
import { pino } from "pino";

const logger = pino();

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.get("/", (req, res) => {
  res.send("HELLO WORLD!");
});

app.listen(port, () => {
  logger.info("Server listening on " + port.toString());
});
