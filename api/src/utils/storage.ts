import disk from "diskusage";
import os from "os";

type ServerStorageInfo = {
  total: number;
  used: number;
};

const path = os.platform() === "win32" ? "c:" : "/";

export const getServerStorage = async () => {
  try {
    const { total, free } = await disk.check(path);

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
