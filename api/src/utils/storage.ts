import disk from "diskusage";
import os from "os";
import fs from "fs";
import path from "path";

type ServerStorageInfo = {
  total: number;
  used: number;
};

const rootServerPath = os.platform() === "win32" ? "c:" : "/";

export const getServerStorage = async () => {
  try {
    const { total, free } = await disk.check(rootServerPath);

    return <ServerStorageInfo>{
      total: Math.round((total / Math.pow(1024, 3)) * 10) / 10,
      used: Math.round(((total - free) / Math.pow(1024, 3)) * 10) / 10,
    };
  } catch (err) {
    console.error(err);

    return <ServerStorageInfo>{
      total: 0,
      used: 0,
    };
  }
};

export const createMediaDirectories = (city_id: string) => {
  const mediaPath = path.join(__dirname, "..", "..", "static", "media");

  try {
    fs.mkdirSync(path.join(mediaPath, "sights", city_id));
    fs.mkdirSync(path.join(mediaPath, "tours", city_id));
    fs.mkdirSync(path.join(mediaPath, "restaurants", city_id));
    fs.mkdirSync(path.join(mediaPath, "hotels", city_id));
    fs.mkdirSync(path.join(mediaPath, "events", city_id));
    fs.mkdirSync(path.join(mediaPath, "about", city_id));
  } catch (_) {
    //pass
  }
};

export const deleteMediaDirectories = (city_id: string) => {
  const mediaPath = path.join(__dirname, "..", "..", "static", "media");

  try {
    fs.rmSync(path.join(mediaPath, "sights", city_id), { recursive: true, force: true });
    fs.rmSync(path.join(mediaPath, "tours", city_id), { recursive: true, force: true });
    fs.rmSync(path.join(mediaPath, "restaurants", city_id), {
      recursive: true,
      force: true,
    });
    fs.rmSync(path.join(mediaPath, "hotels", city_id), { recursive: true, force: true });
    fs.rmSync(path.join(mediaPath, "events", city_id), { recursive: true, force: true });
    fs.rmSync(path.join(mediaPath, "about", city_id), { recursive: true, force: true });
  } catch (_) {
    //pass
  }
};

export const initMediaDirs = () => {
  const mediaPath = path.join(__dirname, "..", "..", "static", "media");

  try {
    fs.mkdirSync(path.join(mediaPath, "sights"));
    fs.mkdirSync(path.join(mediaPath, "tours"));
    fs.mkdirSync(path.join(mediaPath, "restaurants"));
    fs.mkdirSync(path.join(mediaPath, "hotels"));
    fs.mkdirSync(path.join(mediaPath, "events"));
    fs.mkdirSync(path.join(mediaPath, "about"));
  } catch (_) {
    //pass
  }
};
