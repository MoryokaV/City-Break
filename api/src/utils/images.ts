import { Request, Response } from "express";
import sharp from "sharp";

export const uploadImages = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const { folder } = req.params;

  if (!files) {
    return res.status(200).end();
  }

  await Promise.all(
    files.map(async (file: Express.Multer.File) => {
      const path = `./public/static/media/${folder}/${req.session.city_id}/${file.originalname}`;

      const image = sharp(file.buffer);

      const metadata = await image.metadata();
      const { outWidth, outHeight } = calcImageSize(metadata);

      image.resize(outWidth, outHeight);
      image.jpeg({
        quality: 80,
        mozjpeg: true,
      });

      return image.toFile(path);
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
