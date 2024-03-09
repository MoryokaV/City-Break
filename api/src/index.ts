import express, { Express, Response } from "express";
import session from "express-session";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import apiRouter from "./routes/apiRoutes";
import adminRouter from "./routes/adminRoutes";
import loginRouter from "./routes/loginRoutes";
import { connectToDatabase } from "./db";

dotenv.config();

const app: Express = express();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.CB_MONGODB_URL || "";
const SESSION_SECRET = process.env.SESSION_SECRET || "";
const NODE_ENV = process.env.NODE_ENV || "development";

const sessionConfig = {
  secret: SESSION_SECRET,
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
app.use(cookieParser());

app.use("/static", express.static("static"));
app.use(express.static("templates"));

app.use("/api", apiRouter);
app.use("/admin", adminRouter);
app.use(loginRouter);

app.get("/", (_, res: Response) => {
  res.redirect("/admin");
});

connectToDatabase(MONGO_URL).then(() => {
  app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
});
