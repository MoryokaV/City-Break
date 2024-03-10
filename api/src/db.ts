import { Collection, Db, MongoClient } from "mongodb";
import { User } from "./models/userModel";
import { Sight } from "./models/sightModel";
import { Tag } from "./models/tagModel";
import { City } from "./models/cityModel";
import { Tour } from "./models/tourModel";
import { Restaurant } from "./models/restaurantModel";
import { Hotel } from "./models/hotelModel";
import { TrendingItem } from "./models/trendingModel";
import { Event } from "./models/eventModel";

export let db: Db;
export let usersCollection: Collection<User>;
export let cityCollection: Collection<City>;
export let tagsCollection: Collection<Tag>;
export let sightsCollection: Collection<Sight>;
export let toursCollection: Collection<Tour>;
export let restaurantsCollection: Collection<Restaurant>;
export let hotelsCollection: Collection<Hotel>;
export let trendingCollection: Collection<TrendingItem>;
export let eventsCollection: Collection<Event>;

export const connectToDatabase = async (client: MongoClient) => {
  await client
    .connect()
    .then((client: MongoClient) => {
      db = client.db("citybreak");

      usersCollection = db.collection("login");
      cityCollection = db.collection("cities");
      tagsCollection = db.collection("tags");
      sightsCollection = db.collection("sights");
      toursCollection = db.collection("tours");
      restaurantsCollection = db.collection("restaurants");
      hotelsCollection = db.collection("hotels");
      trendingCollection = db.collection("trending");
    })
    .catch(e => {
      console.log(`[database]: An error occurred while connecting to database: ${e}`);
    });
};
