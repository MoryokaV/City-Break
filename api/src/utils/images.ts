import { Request, Response } from "express";
import sharp from "sharp";
import { encode } from "blurhash";
import fs from "fs";
import {
  hotelsCollection,
  restaurantsCollection,
  sightsCollection,
  toursCollection,
} from "../db";

export const uploadImages = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const { folder } = req.params;

  if (!files) {
    return res.status(200).end();
  }

  await Promise.all(
    files.map(async (file: Express.Multer.File) => {
      const fullPath = `./static/media/${folder}/${req.session.city_id}/${file.originalname}`;

      const image = sharp(file.buffer);

      const metadata = await image.metadata();
      const { outWidth, outHeight } = calcImageSize(metadata);

      image.resize(outWidth, outHeight);
      image.jpeg({
        quality: 80,
        mozjpeg: true,
      });

      return image.toFile(fullPath);
    }),
  );

  res.status(200).send("Images have been uploaded");
};

const calcImageSize = (metadata: sharp.Metadata) => {
  const MEDIUM = 1700;
  const LARGE = 2300;

  const { width: w, height: h } = metadata;

  if (!w || !h) {
    throw new Error("Missing metadata for image");
  }

  if (w >= h) {
    let coef = 0;
    let breakpoint = MEDIUM;

    if (w > LARGE) {
      coef = w / LARGE;
      breakpoint = LARGE;
    } else if (w > MEDIUM) {
      coef = w / MEDIUM;
      breakpoint = MEDIUM;
    }

    if (coef !== 0) {
      return { outWidth: breakpoint, outHeight: Math.round(h / coef) };
    }
  } else if (w < h) {
    let coef = 0;
    let breakpoint = MEDIUM;

    if (h > LARGE) {
      coef = h / LARGE;
      breakpoint = LARGE;
    } else if (h > MEDIUM) {
      coef = h / MEDIUM;
      breakpoint = MEDIUM;
    }

    if (coef !== 0) {
      return { outWidth: Math.round(w / coef), outHeight: breakpoint };
    }
  }

  return { outWidth: w, outHeight: h };
};

export const getBlurhashString = async (filePath: string): Promise<string> => {
  const fullPath = "." + filePath;

  const { data, info } = await sharp(fullPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return encode(new Uint8ClampedArray(data), info.width, info.height, 4, 3);
};

export const deleteImages = (images: Array<string>, collection: string): void => {
  images.forEach(async image => {
    const fullPath = "." + image;
    let occurrences = 1;

    if (collection === "sights") {
      occurrences = (await sightsCollection.find({ images: image }).toArray()).length;
    } else if (collection === "tours") {
      occurrences = (await toursCollection.find({ images: image }).toArray()).length;
    } else if (collection === "restaurants") {
      occurrences = (await restaurantsCollection.find({ images: image }).toArray())
        .length;
    } else if (collection === "hotels") {
      occurrences = (await hotelsCollection.find({ images: image }).toArray()).length;
    }
    // else if (collection === "events") {
    //   occurrences = (await sightsCollection.find({ images: image }).toArray())
    //     .length;
    // }

    if (occurrences === 1) {
      try {
        fs.unlinkSync(fullPath);
      } catch (_) {
        //pass
      }
    }
  });
};
