import express from "express";

import { DATABASE_URI, PORT } from "./const";
import { createDatabase } from "./database";
import { createRepository } from "./repository";
import { createRoutes } from "./route";
import { createServices } from "./service";

(async function () {
  const app = express();

  const db = createDatabase({
    DATABASE_URI,
  });

  const repository = createRepository({ db });

  const services = createServices({ repository });

  app.use("/api", createRoutes({ services }));

  app.listen(PORT, () => {
    console.log(`Server Started: (http://localhost:${PORT})`);
  });
})();
