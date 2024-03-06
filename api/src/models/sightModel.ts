import mongoose, { Schema } from "mongoose";

const SightSchema = new Schema({
  name: String,
  description: Array,
  images: Array,
  primary_image: Number,
  latitude: Number,
  longitude: Number,
  external_link: String,
  primary_image_blurhash: String,
  city_id: String,
});

export const Sight = mongoose.model("Sight", SightSchema);
