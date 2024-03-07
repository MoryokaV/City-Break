import { Schema, model } from "mongoose";

interface ISight {
  name: string;
  tags: Array<string>;
  description: string;
  images: Array<string>;
  primary_image: Number;
  latitude: number;
  longitude: number;
  external_link: string;
  primary_image_blurhash: string;
  city_id: string;
}

const SightSchema = new Schema<ISight>({
  name: String,
  tags: Array<string>,
  description: String,
  images: Array<string>,
  primary_image: Number,
  latitude: Number,
  longitude: Number,
  external_link: String,
  primary_image_blurhash: String,
  city_id: String,
});

export const Sight = model<ISight>("Sight", SightSchema);
