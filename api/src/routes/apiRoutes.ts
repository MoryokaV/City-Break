import { Router, Response } from "express";
import { getCurrentUser } from "../controllers/userController";
import sightController from "../controllers/sightController";
import tagController from "../controllers/tagController";
import { getServerStorage } from "../utils/storage";

const apiRouter: Router = Router();

apiRouter.get("/currentUser", getCurrentUser);
apiRouter.get("/serverStorage", async (_, res: Response) => {
  return res.send(await getServerStorage());
});

apiRouter.use(sightController);
apiRouter.use(tagController);

export default apiRouter;
