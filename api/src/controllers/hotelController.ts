import { Response, Router, Request } from "express";
import { ObjectId } from "mongodb";
import { deleteImages, getBlurhashString } from "../utils/images";
import { hotelsCollection } from "../db";
import { Hotel } from "../models/hotelModel";
import { requiresAuth } from "../middleware/auth";
import { filterTrendingByItemId } from "../utils/trending";

const router: Router = Router();

router.get("/fetchHotels", async (req: Request, res: Response) => {
  const { city_id } = req.query;
  const hotels = await hotelsCollection.find({ city_id: city_id }).toArray();

  return res.status(200).send(hotels);
});

router.get("/findHotel/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(404).end();
  }

  const hotel = await hotelsCollection.findOne({ _id: new ObjectId(id) });

  if (hotel == null) {
    return res.status(404).end();
  }

  return res.status(200).send(hotel);
});

router.post("/insertHotel", requiresAuth, async (req: Request, res: Response) => {
  const hotel = req.body as Hotel;
  hotel.primary_image_blurhash = await getBlurhashString(
    hotel.images[hotel.primary_image - 1],
  );
  hotel.city_id = req.session.city_id;

  await hotelsCollection.insertOne(hotel);

  return res.status(200).send("New entry has been inserted");
});

interface UpdateHotelRequestBody {
  images_to_delete: [string];
  _id: string;
  hotel: Hotel;
}

router.put("/editHotel", requiresAuth, async (req: Request, res: Response) => {
  const { images_to_delete, _id, hotel } = req.body as UpdateHotelRequestBody;

  hotel.primary_image_blurhash = await getBlurhashString(
    hotel.images[hotel.primary_image - 1],
  );

  deleteImages(images_to_delete, "hotels");

  await hotelsCollection.updateOne({ _id: new ObjectId(_id) }, { $set: hotel });

  return res.status(200).send("Entry has been updated");
});

router.delete("/deleteHotel/:_id", requiresAuth, async (req: Request, res: Response) => {
  const { _id } = req.params;

  const images: Array<string> | undefined = (
    await hotelsCollection.findOne({ _id: new ObjectId(_id) })
  )?.images;

  if (images) {
    deleteImages(images, "hotels");
  }

  //remove from trending
  filterTrendingByItemId(_id, req.session.city_id);

  await hotelsCollection.deleteOne({ _id: new ObjectId(_id) });

  return res.status(200).send("Successfully deleted document");
});

export default router;
