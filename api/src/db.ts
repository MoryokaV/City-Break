import { Collection, Db, MongoClient } from "mongodb";
import { User } from "./models/userModel";
import { Sight } from "./models/sightModel";
import { Tag } from "./models/tagModel";

export let db: Db;
export let usersCollection: Collection<User>;
export let sightsCollection: Collection<Sight>;
export let tagsCollection: Collection<Tag>;

export const connectToDatabase = async (url: string) => {
  await MongoClient.connect(url)
    .then((client: MongoClient) => {
      db = client.db("citybreak");

      usersCollection = db.collection("login");
      sightsCollection = db.collection("sights");
      tagsCollection = db.collection("tags");
    })
    .catch((e) => {
      console.log(
        `[database]: An error occurred while connecting to database: ${e}`,
      );
    });
};
