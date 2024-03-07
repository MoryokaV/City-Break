import { Response, Router, Request, RequestHandler } from "express";
import { ISight, Sight } from "../models/sightModel";

const router = Router();

router.get("/fetchSights", async (req: Request, res: Response) => {
  const { city_id } = req.query;
  const sights = await Sight.find({ city_id: city_id });

  res.status(200).send(sights);
});

router.get("/findSight/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const sight = await Sight.findById(id);

  res.status(200).send(sight);
});

interface UpdateSightRequestBody {
  images_to_delete: [string];
  _id: string;
  sight: ISight;
}

router.put("/editSight", async (req: Request, res: Response) => {
  const { images_to_delete, _id, sight } = <UpdateSightRequestBody>req.body;

  console.log(_id);
  console.log(sight);

  //delete images

  await Sight.findByIdAndUpdate(_id, sight);

  res.status(200).send("Entry has been updated");
});

/*
@app.route("/api/editSight", methods=["PUT"])
@login_required
def editSight():
    data = request.get_json()

    deleteImages(data['images_to_delete'], 'sights')

    sight = data['sight']
    sight['latitude'] = float(sight['latitude'])
    sight['longitude'] = float(sight['longitude'])
    sight['primary_image_blurhash'] = getBlurhash(sight['images'][sight['primary_image'] - 1])

    db.sights.update_one({"_id": ObjectId(data['_id'])}, {"$set": sight})

    return make_response("Entry has been updated", 200)
*/

export default router;
