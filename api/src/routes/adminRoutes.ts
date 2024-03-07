import { Router, Response } from "express";
import path from "path";

const adminRouter = Router();

const templatesDir = path.join(__dirname, "..", "..", "public", "templates");

adminRouter.get("/", (_, res: Response) => {
  res.sendFile(path.join(templatesDir, "index.html"));
});

adminRouter.get("/tags", (_, res: Response) => {
  res.sendFile(path.join(templatesDir, "tags.html"));
});

adminRouter.get("/sights", (_, res: Response) => {
  res.sendFile(path.join(templatesDir, "sights.html"));
});

adminRouter.get("/tours", (_, res: Response) => {
  res.sendFile(path.join(templatesDir, "tours.html"));
});

adminRouter.get("/restaurants", (_, res: Response) => {
  res.sendFile(path.join(templatesDir, "restaurants.html"));
});

adminRouter.get("/hotels", (_, res: Response) => {
  res.sendFile(path.join(templatesDir, "hotels.html"));
});

adminRouter.get("/events", (_, res: Response) => {
  res.sendFile(path.join(templatesDir, "events.html"));
});

adminRouter.get("/trending", (_, res: Response) => {
  res.sendFile(path.join(templatesDir, "trending.html"));
});

adminRouter.get("/about", (_, res: Response) => {
  res.sendFile(path.join(templatesDir, "about.html"));
});

export default adminRouter;
