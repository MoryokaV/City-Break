import { Response, Router, Request } from "express";
import { ISight } from "../models/sightModel";
import { sightsCollection } from "../db";
import { ObjectId } from "mongodb";

const router: Router = Router();

router.get("/fetchSights", async (req: Request, res: Response) => {
  const { city_id } = req.query;
  const sights = await sightsCollection.find({ city_id: city_id }).toArray();

  return res.status(200).send(sights);
});

router.get("/findSight/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(404).end();
  }

  const sight = await sightsCollection.findOne({ _id: new ObjectId(id) });

  if (sight == null) {
    return res.status(404).end();
  }

  return res.status(200).send(sight);
});

interface UpdateSightRequestBody {
  images_to_delete: [string];
  _id: string;
  sight: ISight;
}

router.put("/editSight", async (req: Request, res: Response) => {
  const { images_to_delete, _id, sight } = req.body as UpdateSightRequestBody;

  //delete images

  // await Sight.findByIdAndUpdate(_id, sight);
  await sightsCollection.updateOne({ _id: new ObjectId(_id) }, { $set: sight });

  return res.status(200).send("Entry has been updated");
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
