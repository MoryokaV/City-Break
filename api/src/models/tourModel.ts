export type Tour = {
  name: string;
  stages: Array<Stage>;
  description: string;
  images: Array<string>;
  primary_image: number;
  length: number;
  external_link: string;
  city_id: string;
};

type Stage = {
  text: string;
  sight_link: string;
};
