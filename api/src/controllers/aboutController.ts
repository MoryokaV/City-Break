import { Request, Response, Router } from "express";
import { aboutCollection } from "../db";
import { requiresAuth } from "../middleware/auth";
import { deleteImages, getBlurhashString } from "../utils/images";

const router: Router = Router();

router.get("/fetchAboutData", async (req: Request, res: Response) => {
  const { city_id } = req.query;

  const aboutData = await aboutCollection.findOne({ city_id: city_id });

  return res.status(200).send(aboutData);
});

router.put("/updateAbout", async (req: Request, res: Response) => {
  const about = req.body;

  await aboutCollection.updateOne({ city_id: req.session.city_id }, { $set: about });

  return res.status(200).send("Entry has been updated");
});

interface HeaderRequestBody {
  header_title: string;
  header_image: string;
}

router.put("/updateHeader", requiresAuth, async (req: Request, res: Response) => {
  const header = req.body as HeaderRequestBody;

  const about = await aboutCollection.findOne({ city_id: req.session.city_id });

  if (about!.header_image !== header.header_image) {
    deleteImages([about!.header_image], "about");
  }

  await aboutCollection.updateOne({ city_id: req.session.city_id }, { $set: header });

  return res.status(200).send("Entry has been updated");
});

router.put("/updateCoverImage", requiresAuth, async (req: Request, res: Response) => {
  const newImg = req.body as { path: string };
  const newImgBlurhash = await getBlurhashString(newImg.path);

  const about = await aboutCollection.findOne({ city_id: req.session.city_id });

  if (about) {
    deleteImages([about.cover_image], "about");
  }

  await aboutCollection.updateOne(
    { city_id: req.session.city_id },
    { $set: { cover_image: newImg.path, cover_image_blurhash: newImgBlurhash } },
  );

  return res.status(200).send("Entry has been updated");
});

export default router;
