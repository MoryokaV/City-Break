import { Double } from "mongodb";

export interface ISight {
  name: string;
  tags: Array<string>;
  description: string;
  images: Array<string>;
  primary_image: Number;
  latitude: Double;
  longitude: Double;
  external_link: string;
  primary_image_blurhash: string;
  city_id: string;
}
