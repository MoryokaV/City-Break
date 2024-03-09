import { Router } from "express";
import { getCurrentUser } from "../controllers/userController";
import sightController from "../controllers/sightController";
import tagController from "../controllers/tagController";

const apiRouter: Router = Router();

apiRouter.get("/currentUser", getCurrentUser);

apiRouter.use(sightController);
apiRouter.use(tagController);

export default apiRouter;
