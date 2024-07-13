import express, { Express, Response } from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import apiRouter from "./routes/apiRoutes";
import loginRouter from "./routes/loginRoutes";
import {
  citiesCollection,
  connectToDatabase,
  hotelsCollection,
  restaurantsCollection,
  sightsCollection,
  toursCollection,
} from "./db";
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

app.use("/api", apiRouter);
app.use("/api", loginRouter);

app.get("/", (_, res: Response) => {
  return res.redirect("/admin");
});

// const addIndex = async () => {
//   const cities = await citiesCollection.find().toArray();

//   for (const city of cities) {
//     const items = await toursCollection.find({ city_id: city.city_id }).toArray();
//     console.log(city.city_id);

//     for (let i = 0; i < items.length; i++) {
//       await toursCollection.updateOne(
//         { _id: new ObjectId(items[i]._id) },
//         { $set: { index: i } },
//       );
//     }
//   }

//   console.log("finished");
// };

connectToDatabase(client).then(() => {
  ServerStorage.initMediaDirs();

  app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
});
