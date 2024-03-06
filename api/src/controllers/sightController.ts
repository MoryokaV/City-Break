import { Request, Response, Router } from "express";

const router = Router();

router.get("/fetchSights", (req: Request, res: Response) => {
  res.send("Fetch sights");
});

export default router;
