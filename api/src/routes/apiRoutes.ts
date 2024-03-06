import { Router } from "express";
import sightController from "../controllers/sightController";

const apiRouter = Router();

apiRouter.use(sightController);

export default apiRouter;
