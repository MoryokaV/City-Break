import { Response, Router, Request } from "express";
import { Sight } from "../models/sightModel";

const router = Router();

router.get("/fetchSights", async (_, res: Response) => {
  const sights = await Sight.find({});

  res.status(200).send(sights);
});

router.get("/findSight/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const sight = await Sight.findById(id);

  res.status(200).send(sight);
});

export default router;
