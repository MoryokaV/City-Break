import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import session from "express-session";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import apiRouter from "./routes/apiRoutes";
import adminRouter from "./routes/adminRoutes";
import loginRouter from "./routes/loginRoutes";

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

app.use(express.static("public"));

app.use("/api", apiRouter);
app.use("/admin", adminRouter);
app.use(loginRouter);

app.get("/", (_, res: Response) => {
  res.redirect("/admin");
});

mongoose.connect(MONGO_URL).then((conn) => {
  console.log(`Connected to database. Host ${conn.connection.host}`);

  app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
});
