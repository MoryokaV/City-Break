import { Router, Request, Response } from "express";
import { requiresAuth, requiresMasterAuth } from "../middleware/auth";
import {
  aboutCollection,
  citiesCollection,
  eventsCollection,
  hotelsCollection,
  restaurantsCollection,
  sightsCollection,
  tagsCollection,
  toursCollection,
  trendingCollection,
  usersCollection,
} from "../db";
import * as uuid from "uuid";
import { About } from "../models/aboutModel";
import * as ServerStorage from "../utils/storage";
import { createHash } from "crypto";

const router: Router = Router();

router.get("/currentCityName", requiresAuth, (req: Request, res: Response) => {
  return res.status(200).send({ name: req.session.city_name });
});

router.get("/fetchAdminUsers", requiresMasterAuth, async (_, res: Response) => {
  const users = await usersCollection.find({ admin: true }).toArray();

  return res.status(200).send(users);
});

router.get("/fetchCities", async (_, res: Response) => {
  const cities = await citiesCollection.find().toArray();

  return res.status(200).send(cities);
});

router.get("/findCity/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const city = await citiesCollection.findOne({ city_id: id });

  return res.status(200).send(city);
});

interface InsertCityRequestBody {
  name: string;
  state: string;
  city_id: string;
  fullname: string;
  username: string;
  password: string;
  admin: boolean;
}

router.post("/insertCity", requiresMasterAuth, async (req: Request, res: Response) => {
  const cityUser = req.body as InsertCityRequestBody;

  // set unique ID
  const buffer = Buffer.alloc(16);
  uuid.v4({}, buffer);
  cityUser.city_id = buffer.toString("hex");

  await citiesCollection.insertOne({
    name: cityUser.name,
    state: cityUser.state,
    city_id: cityUser.city_id,
  });

  cityUser.password = createHash("sha256").update(cityUser.password).digest("hex");

  await usersCollection.insertOne({
    fullname: cityUser.fullname,
    username: cityUser.username,
    password: cityUser.password,
    city_id: cityUser.city_id,
    admin: true,
  });

  // initialize about document with empty strings
  const about: About = {
    paragraph1: "",
    heading1: "",
    phone: "",
    email: "",
    cover_image: "",
    cover_image_blurhash: "",
    organiation: "",
    website: "",
    facebook: "",
    header_title: "",
    header_image: "",
    city_id: cityUser.city_id,
  };

  await aboutCollection.insertOne(about);

  ServerStorage.createMediaDirectories(cityUser.city_id);

  return res.status(200).send("New entry has been inserted");
});

router.delete(
  "/deleteCity/:id",
  requiresMasterAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    await sightsCollection.deleteMany({ city_id: id });
    await toursCollection.deleteMany({ city_id: id });
    await restaurantsCollection.deleteMany({ city_id: id });
    await hotelsCollection.deleteMany({ city_id: id });
    await eventsCollection.deleteMany({ city_id: id });
    await tagsCollection.deleteMany({ city_id: id });
    await trendingCollection.deleteMany({ city_id: id });
    await aboutCollection.deleteOne({ city_id: id });
    await usersCollection.deleteMany({ city_id: id });
    await citiesCollection.deleteOne({ city_id: id });

    ServerStorage.deleteMediaDirectories(id);

    return res.status(200).send("Successfully deleted document");
  },
);

export default router;
