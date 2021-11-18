"use strict";

// json as middleware for parsing http input as json
import express, { json } from "express";
import { host, httpPort } from "./server/config/env.js"
import { allRoutes } from "./server/router/routes.js";
// for database connection
import { connectWithRetries } from "./server/model/service.js";
// for log files
import { existsSync, mkdirSync } from "fs";
const logDir = "Book-Collection-Server-Logs";
import { logger } from "./server/config/logConfig.js";

//create the log directory if it does not already exist
if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

//initialize express
const app = express();

// connect to the database
connectWithRetries();

//Middleware for parsing http input as json
app.use(json());

// load all routes
allRoutes(app);

// server starts listening
app.listen(httpPort, () => {
  logger.info(`Starting the books collection app server at ${host}:${httpPort}`);
});

export { app }
