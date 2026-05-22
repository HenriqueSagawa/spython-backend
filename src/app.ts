import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();


app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api", router);

app.use(errorHandler);

export default app;