import { Response, Router, Request } from "express";
import { ObjectId } from "mongodb";
import { toursCollection } from "../db";
import { Tour } from "../models/tourModel";
import { deleteImages } from "../utils/images";
import { requiresAuth } from "../middleware/auth";

const router: Router = Router();

router.get("/fetchTours", async (req: Request, res: Response) => {
  const { city_id } = req.query;
  const tours = await toursCollection.find({ city_id: city_id }).toArray();

  return res.status(200).send(tours);
});

router.get("/findTour/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(404).end();
  }

  const tour = await toursCollection.findOne({ _id: new ObjectId(id) });

  if (tour == null) {
    return res.status(404).end();
  }

  return res.status(200).send(tour);
});

router.post(
  "/insertTour",
  requiresAuth,
  async (req: Request, res: Response) => {
    const tour = req.body as Tour;
    tour.city_id = req.session.city_id;

    await toursCollection.insertOne(tour);

    return res.status(200).send("New entry has been inserted");
  },
);

interface UpdateTourRequestBody {
  images_to_delete: [string];
  _id: string;
  tour: Tour;
}

router.put("/editTour", requiresAuth, async (req: Request, res: Response) => {
  const { images_to_delete, _id, tour } = req.body as UpdateTourRequestBody;

  deleteImages(images_to_delete, "tours");

  await toursCollection.updateOne({ _id: new ObjectId(_id) }, { $set: tour });

  return res.status(200).send("Entry has been updated");
});

router.delete(
  "/deleteTour/:_id",
  requiresAuth,
  async (req: Request, res: Response) => {
    const { _id } = req.params;

    const images: Array<string> | undefined = (
      await toursCollection.findOne({ _id: new ObjectId(_id) })
    )?.images;

    if (images) {
      deleteImages(images, "tours");
    }

    toursCollection.deleteOne({ _id: new ObjectId(_id) });

    return res.status(200).send("Successfully deleted document");
  },
);

export default router;
