import express, { Express, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import apiRouter from "./routes/apiRoutes";
import connectToDatabse from "./dbconnect";
import adminRouter from "./routes/adminRoutes";

dotenv.config();
connectToDatabse();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static("public"));

app.use("/api", apiRouter);
app.use("/admin", adminRouter);

//TO REMOVE
app.get("/", (_, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "public/templates", "index.html"));
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
