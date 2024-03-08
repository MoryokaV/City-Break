import { Router } from "express";
import sightController from "../controllers/sightController";
import { getCurrentUser } from "../controllers/userController";

const apiRouter: Router = Router();

apiRouter.get("/currentUser", getCurrentUser);
apiRouter.use(sightController);

export default apiRouter;
