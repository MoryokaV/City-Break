import { Router, Request, Response } from "express";
import { requiresAuth, requiresMasterAuth } from "../middleware/auth";
import {
  citiesCollection,
  sightsCollection,
  toursCollection,
  usersCollection,
} from "../db";
import { City } from "../models/cityModel";
import * as uuid from "uuid";

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

  // await citiesCollection.insertOne({
  //   name: cityUser.name,
  //   state: cityUser.state,
  //   city_id: cityUser.city_id,
  // });
  //
  // await usersCollection.insertOne({
  //   fullname: cityUser.fullname,
  //   username: cityUser.username,
  //   password: "",
  //   city_id: cityUser.city_id,
  //   admin: true,
  // });

  //db.about.insert_one({"paragraph1": "", "phone": "", "email": "", "cover_image": "", "organization": "", "website": "", "facebook": "", "cover_image_blurhash": "", "heading1": "", "header_image": "", "header_title": "", "city_id": city_id})

  //createMediaDirectories

  return res.status(200).send("New entry has been inserted");
});

router.delete(
  "/deleteCity/:id",
  requiresMasterAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    // await sightsCollection.deleteMany({ city_id: id });
    // await toursCollection.deleteMany({ city_id: id });

    return res.status(200).send("Successfully deleted document");
  },
);

export default router;
