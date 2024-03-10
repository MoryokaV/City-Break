import { Request, Response, Router } from "express";
import { Tag } from "../models/tagModel";
import { ObjectId } from "mongodb";
import { Sight } from "../models/sightModel";
import { Restaurant } from "../models/restaurantModel";
import { Hotel } from "../models/hotelModel";
import {
  hotelsCollection,
  restaurantsCollection,
  sightsCollection,
  tagsCollection,
} from "../db";

const router: Router = Router();

router.get("/fetchTags/:used_for", async (req: Request, res: Response) => {
  const { used_for } = req.params;
  const { city_id } = req.query;

  let tags: Array<Tag>;

  if (used_for === "all") {
    tags = await tagsCollection.find({ city_id: city_id }).toArray();
  } else {
    tags = await tagsCollection
      .find({ city_id: city_id, used_for: used_for })
      .toArray();
  }

  return res.status(200).send(tags);
});

router.post("/insertTag", async (req: Request, res: Response) => {
  const tag = req.body as Tag;
  tag.city_id = req.session.city_id;

  await tagsCollection.insertOne(tag);

  return res.status(200).send("New entry inserted");
});

router.delete("/deleteTag/:_id", async (req: Request, res: Response) => {
  const { _id } = req.params;

  const tag = await tagsCollection.findOne({ _id: new ObjectId(_id) });

  if (!tag) {
    return res.status(404).end();
  }

  if (tag.used_for === "sights") {
    const sights = await sightsCollection
      .find({ city_id: req.session.city_id })
      .toArray();

    await Promise.all(
      sights.map(async (sight: Sight) => {
        const index = sight.tags.indexOf(tag.name);
        if (index !== -1) {
          sight.tags.splice(index, 1);
        }

        return sightsCollection.updateOne(
          { _id: new ObjectId(sight._id) },
          { $set: sight },
        );
      }),
    );
  } else if (tag.used_for === "restaurants") {
    const restaurants = await restaurantsCollection
      .find({ city_id: req.session.city_id })
      .toArray();

    await Promise.all(
      restaurants.map(async (restaurant: Restaurant) => {
        const index = restaurant.tags.indexOf(tag.name);
        if (index !== -1) {
          restaurant.tags.splice(index, 1);
        }

        return restaurantsCollection.updateOne(
          { _id: new ObjectId(restaurant._id) },
          { $set: restaurant },
        );
      }),
    );
  } else if (tag.used_for === "hotels") {
    const hotels = await hotelsCollection
      .find({
        city_id: req.session.city_id,
      })
      .toArray();

    await Promise.all(
      hotels.map(async (hotel: Hotel) => {
        const index = hotel.tags.indexOf(tag.name);
        if (index !== -1) {
          hotel.tags.splice(index, 1);
        }

        return hotelsCollection.updateOne(
          { _id: new ObjectId(hotel._id) },
          { $set: hotel },
        );
      }),
    );
  }

  tagsCollection.deleteOne({ _id: new ObjectId(_id) });

  res.status(200).send("Successfully deleted document");
});

export default router;
