import { Collection, Db, MongoClient } from "mongodb";
import { IUser } from "./models/userModel";
import { ISight } from "./models/sightModel";

export let db: Db;
export let usersCollection: Collection<IUser>;
export let sightsCollection: Collection<ISight>;

export const connectToDatabase = async (url: string) => {
  await MongoClient.connect(url)
    .then((client: MongoClient) => {
      db = client.db("citybreak");

      usersCollection = db.collection("login");
      sightsCollection = db.collection("sights");
    })
    .catch((e) => {
      console.log(
        `[database]: An error occurred while connecting to database: ${e}`,
      );
    });
};
