import { Request, Response, Router } from "express";
import { TrendingItem } from "../models/trendingModel";
import { trendingCollection } from "../db";
import { requiresAuth } from "../middleware/auth";
import { ObjectId } from "mongodb";

const router: Router = Router();

router.get("/fetchTrendingItems", async (req: Request, res: Response) => {
  const { city_id } = req.query;
  const trending = await trendingCollection
    .find({ city_id: city_id })
    .sort("index", 1)
    .toArray();

  return res.status(200).send(trending);
});

router.post("/insertTrendingItem", requiresAuth, async (req: Request, res: Response) => {
  const trendingItem = req.body as TrendingItem;
  trendingItem.city_id = req.session.city_id;

  await trendingCollection.insertOne(trendingItem);

  return res.status(200).send("New entry has been inserted");
});

interface UpdateIndexRequestBody {
  oldIndex: number;
  newIndex: number;
  items: Array<string>;
}

router.put("/updateTrendingItemIndex", (req: Request, res: Response) => {
  const { oldIndex, newIndex, items } = req.body as UpdateIndexRequestBody;

  let j = 0;
  for (let i = Math.min(oldIndex, newIndex); i <= Math.max(oldIndex, newIndex); i++) {
    trendingCollection.updateOne({ _id: new ObjectId(items[j]) }, { $set: { index: i } });
    j++;
  }

  return res.status(200).send("Trending order has been updated");
});

interface DeleteItemQueryParams {
  _id?: string;
  index?: number;
}

router.delete("/deleteTrendingItem", async (req: Request, res: Response) => {
  const { _id, index } = req.query as DeleteItemQueryParams;

  if (!_id || !index) {
    return res.status(400).end();
  }

  const trending = await trendingCollection
    .find({ city_id: req.session.city_id })
    .toArray();

  await Promise.all(
    trending.map(async item => {
      if (item.index > index) {
        return trendingCollection.updateOne(
          { _id: new ObjectId(item._id) },
          { $set: { index: item.index - 1 } },
        );
      }
    }),
  );

  await trendingCollection.deleteOne({ _id: new ObjectId(_id) });

  return res.status(200).send("Successfully deleted document");
});

export default router;
