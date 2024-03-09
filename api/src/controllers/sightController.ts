import { Response, Router, Request } from "express";
import { ObjectId } from "mongodb";
import { sightsCollection } from "../db";
import { Sight } from "../models/sightModel";

const router: Router = Router();

router.get("/fetchSights", async (req: Request, res: Response) => {
  const { city_id } = req.query;
  const sights = await sightsCollection.find({ city_id: city_id }).toArray();

  return res.status(200).send(sights);
});

router.get("/findSight/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(404).end();
  }

  const sight = await sightsCollection.findOne({ _id: new ObjectId(id) });

  if (sight == null) {
    return res.status(404).end();
  }

  return res.status(200).send(sight);
});

interface UpdateSightRequestBody {
  images_to_delete: [string];
  _id: string;
  sight: Sight;
}

router.put("/editSight", async (req: Request, res: Response) => {
  const { images_to_delete, _id, sight } = req.body as UpdateSightRequestBody;

  //delete images

  await sightsCollection.updateOne({ _id: new ObjectId(_id) }, { $set: sight });

  return res.status(200).send("Entry has been updated");
});

router.post("/insertSight", async (req: Request, res: Response) => {
  const sight = req.body as Sight;

  //save images

  await sightsCollection.insertOne(sight);

  return res.status(200).send("New entry has been inserted");
});

export default router;
