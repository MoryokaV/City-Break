import { Router } from "express";
import sightController from "../controllers/sightController";
import { getCurrentUser } from "../controllers/userController";

const apiRouter = Router();

apiRouter.use(sightController);
apiRouter.get("/currentUser", getCurrentUser);

export default apiRouter;
