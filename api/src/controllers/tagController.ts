import { Request, Response, Router } from "express";
import { tagsCollection } from "../db";
import { Tag } from "../models/tagModel";

const router: Router = Router();

router.get("/fetchTags/:used_for", async (req: Request, res: Response) => {
  const { used_for } = req.params;
  const { city_id } = req.query;

  let tags: Array<Tag>;

  if (used_for === "all") {
    tags = await tagsCollection.find({ city_id: city_id }).toArray();
  }

  tags = await tagsCollection
    .find({ city_id: city_id, used_for: used_for })
    .toArray();

  return tags;
});

export default router;
