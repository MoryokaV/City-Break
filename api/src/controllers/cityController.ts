import { Router, Request, Response } from "express";

const router: Router = Router();

router.get("/currentCityName", (req: Request, res: Response) => {
  res.send({ name: req.session.city_name });
});

export default router;
