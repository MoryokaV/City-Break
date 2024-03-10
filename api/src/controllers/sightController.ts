import { Response, Router, Request } from "express";
import { ObjectId } from "mongodb";
import { sightsCollection } from "../db";
import { Sight } from "../models/sightModel";
import { deleteImages, getBlurhashString } from "../utils/images";
import { requiresAuth } from "../middleware/auth";

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

router.post(
  "/insertSight",
  requiresAuth,
  async (req: Request, res: Response) => {
    const sight = req.body as Sight;
    sight.primary_image_blurhash = await getBlurhashString(
      sight.images[sight.primary_image - 1],
    );
    sight.city_id = req.session.city_id;

    await sightsCollection.insertOne(sight);

    return res.status(200).send("New entry has been inserted");
  },
);

interface UpdateSightRequestBody {
  images_to_delete: [string];
  _id: string;
  sight: Sight;
}

router.put("/editSight", requiresAuth, async (req: Request, res: Response) => {
  const { images_to_delete, _id, sight } = req.body as UpdateSightRequestBody;

  sight.primary_image_blurhash = await getBlurhashString(
    sight.images[sight.primary_image - 1],
  );

  deleteImages(images_to_delete, "sights");

  await sightsCollection.updateOne({ _id: new ObjectId(_id) }, { $set: sight });

  return res.status(200).send("Entry has been updated");
});

router.delete(
  "/deleteSight/:_id",
  requiresAuth,
  async (req: Request, res: Response) => {
    const { _id } = req.params;

    const images: Array<string> | undefined = (
      await sightsCollection.findOne({ _id: new ObjectId(_id) })
    )?.images;

    if (images) {
      deleteImages(images, "sights");
    }

    //remove from trending

    sightsCollection.deleteOne({ _id: new ObjectId(_id) });

    return res.status(200).send("Successfully deleted document");
  },
);

export default router;
