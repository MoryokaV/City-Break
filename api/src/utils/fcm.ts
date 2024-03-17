import admin, { messaging } from "firebase-admin";
import { MongoClient } from "mongodb";
import { City } from "../models/cityModel";
import { Event } from "../models/eventModel";
import dotenv from "dotenv";
import path from "path";
import dayjs from "dayjs";
import isTomorrow from "dayjs/plugin/isTomorrow";

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const FIREBASE_CREDENTIALS = process.env.CB_FIREBASE_CREDENTIALS || "";
const MONGO_URL = process.env.CB_MONGODB_URL || "";

admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_CREDENTIALS),
});

dayjs.extend(isTomorrow);

const sendDailyNotification = async () => {
  const client = new MongoClient(MONGO_URL);
  const db = client.db("citybreak");
  const citiesCollection = db.collection<City>("cities");
  const eventsCollection = db.collection<Event>("events");

  const cities = await citiesCollection.find().toArray();

  for (let city of cities) {
    const events = await eventsCollection
      .find({ city_id: city.city_id })
      .sort({ date_time: 1 })
      .toArray();
    let tomorrow_events = 0;

    for (let event of events) {
      const event_date = dayjs(event.date_time);

      if (event_date.isTomorrow()) {
        tomorrow_events += 1;
      } else if (event_date.isAfter(dayjs().add(1, "days"))) {
        break;
      }
    }

    if (tomorrow_events === 0) {
      continue;
    }

    const title = "Mâine în orașul tău";
    let body = "";

    if (tomorrow_events === 1) {
      body = "Un eveniment nou";
    } else if (tomorrow_events === 2) {
      body = "Două evenimente noi";
    } else if (tomorrow_events < 20) {
      body = `${tomorrow_events} evenimente noi`;
    } else {
      body = `${tomorrow_events} de evenimente noi`;
    }

    const H18inMS: number = 64800000; // 18 hours in ms
    const appleTTL = dayjs().add(18, "hours").unix();

    const message: messaging.Message = {
      notification: {
        title: title,
        body: body,
      },
      data: {
        type: "tomorrow_events",
      },
      android: {
        // priority: "high" // wake devices from doze mode (bad for energy)
        ttl: H18inMS, // live notification for 18 hours
      },
      apns: {
        headers: {
          "apns-expiration": appleTTL.toString(), // 18 hours from now
          // "apns-priority": "10" // send notification immediately (bad for energy, default: 5)
        },
      },
      topic: city.city_id,
    };

    admin.messaging().send(message);
  }
};

export const sendNewEventNotification = (
  name: string,
  _id: string,
  city_id: string,
  city_name: string,
) => {
  const H18inMS: number = 64800000; // 18 hours in ms
  const appleTTL: number = Date.now() + H18inMS; // apns-expiration should be in UNIX epoch time format

  const message = {
    notification: {
      title: "Un nou eveniment in " + city_name + "!",
      body: name,
    },
    data: {
      type: "event",
      id: _id,
    },
    android: {
      // priority: "high" // wake devices from doze mode (bad for energy)
      ttl: H18inMS, // live notification for 18 hours
    },
    apns: {
      headers: {
        "apns-expiration": appleTTL.toString(), // 18 hours from now
        // "apns-priority": "10" // send notification immediately (bad for energy, default: 5)
      },
    },
    topic: city_id,
  };

  admin.messaging().send(message);
};
