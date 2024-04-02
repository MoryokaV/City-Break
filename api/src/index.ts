import express, { Express, Response } from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import apiRouter from "./routes/apiRoutes";
import adminRouter from "./routes/adminRoutes";
import loginRouter from "./routes/loginRoutes";
import { connectToDatabase } from "./db";
import path from "path";
import * as ServerStorage from "./utils/storage";

dotenv.config();

const app: Express = express();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.CB_MONGODB_URL || "";
const SESSION_SECRET = process.env.SESSION_SECRET || "";
const NODE_ENV = process.env.NODE_ENV || "development";

const client: MongoClient = new MongoClient(MONGO_URL);

const sessionConfig = {
  secret: SESSION_SECRET,
  store: MongoStore.create({
    client: client, //re-use the existing client
    dbName: "citybreak",
    touchAfter: 24 * 3600, //refresh only after a day
    crypto: {
      secret: "squirrel", //encrypt the content
    },
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
  },
};

if (NODE_ENV === "production") {
  app.set("trust proxy", 1);
  sessionConfig.cookie.secure = true;
}

app.use(session(sessionConfig));

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/static", express.static(path.join(__dirname, "..", "/static")));
app.use(express.static("templates"));

app.use("/api", apiRouter);
// app.use("/admin", adminRouter);
app.use("/api", loginRouter);

app.get("/", (_, res: Response) => {
  return res.redirect("/admin");
});

app.get("/favicon.ico", (_, res: Response) => {
  return res.sendFile(path.join(__dirname, "..", "/static/favicon.ico"));
});

app.get("/apple-touch-icon.png", (_, res: Response) => {
  return res.sendFile(path.join(__dirname, "..", "/static/apple-touch-icon.png"));
});

connectToDatabase(client).then(() => {
  ServerStorage.initMediaDirs();

  app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
});
