import { Router, Response } from "express";
import { getServerStorage } from "../utils/storage";
import { uploadImages } from "../utils/images";
import multer from "multer";
import sightController from "../controllers/sightController";
import tagController from "../controllers/tagController";
import cityController from "../controllers/cityController";
import tourController from "../controllers/tourController";
import restaurantController from "../controllers/restaurantController";
import hotelController from "../controllers/hotelController";
import trendingController from "../controllers/trendingController";
import aboutController from "../controllers/aboutController";

const apiRouter: Router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

apiRouter.get("/serverStorage", async (_, res: Response) =>
  res.status(200).send(await getServerStorage()),
);
apiRouter.post("/uploadImages/:folder", upload.array("files[]"), uploadImages);

apiRouter.use(sightController);
apiRouter.use(tagController);
apiRouter.use(cityController);
apiRouter.use(tourController);
apiRouter.use(restaurantController);
apiRouter.use(hotelController);
apiRouter.use(trendingController);
apiRouter.use(aboutController);

export default apiRouter;
