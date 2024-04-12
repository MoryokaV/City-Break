export type Event = {
  _id: string;
  name: string;
  description: string;
  images: Array<string>;
  primary_image: number;
  external_link: string;
  primary_image_blurhash: string;
  date_time: Date;
  end_date_time: Date | null;
  expire_at: Date;
  city_id: string;
};
