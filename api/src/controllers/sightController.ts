import { Response, Router } from "express";
import { Sight } from "../models/sightModel";

const router = Router();

router.get("/fetchSights", async (_, res: Response) => {
  const sights = await Sight.find({});
  res.send(sights);
});

export default router;
