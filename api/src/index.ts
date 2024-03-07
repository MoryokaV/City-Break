import express, { Express, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import apiRouter from "./routes/apiRoutes";
import adminRouter from "./routes/adminRoutes";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.CB_MONGODB_URL || "";

app.use(express.json());

app.use(express.static("public"));

app.use("/api", apiRouter);
app.use("/admin", adminRouter);

//TO REMOVE
app.get("/", (_, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "public/templates", "index.html"));
});

mongoose.connect(MONGO_URL).then((conn) => {
  console.log(`Connected to databse. Host ${conn.connection.host}`);

  app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
});
