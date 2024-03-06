import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import apiRouter from "./routes/apiRoutes";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use("/api", apiRouter);

app.use(express.static("public"));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "public/templates", "index.html"));
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
