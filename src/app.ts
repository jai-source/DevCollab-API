import express from "express";
import cors from "cors";
import helmet from "helmet";

import {requestLogger} from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";
import {rateLimmeter} from "./middleware/rateLimmeter";

import router from "./routes/index";

const app = express();

app.use(helmet());
app.use(cors());
app.use(requestLogger);
app.use(express.json({limit: "1mb"}));
app.use(rateLimmeter);
app.use("/api/v1" , router);
app.use(errorHandler);

export default app;