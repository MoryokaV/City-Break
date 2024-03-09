import { Router, Response } from "express";
import path from "path";
import { requiresAuth } from "../middleware/auth";

const adminRouter = Router();

const templatesDir = path.join(__dirname, "..", "..", "templates");

adminRouter.get("/", requiresAuth, (_, res: Response) => {
  res.sendFile(path.join(templatesDir, "index.html"));
});

adminRouter.get("/tags", requiresAuth, (_, res: Response) => {
  res.sendFile(path.join(templatesDir, "tags.html"));
});

adminRouter.get("/sights", requiresAuth, (_, res: Response) => {
  res.sendFile(path.join(templatesDir, "sights.html"));
});

adminRouter.get("/tours", requiresAuth, (_, res: Response) => {
  res.sendFile(path.join(templatesDir, "tours.html"));
});

adminRouter.get("/restaurants", requiresAuth, (_, res: Response) => {
  res.sendFile(path.join(templatesDir, "restaurants.html"));
});

adminRouter.get("/hotels", requiresAuth, (_, res: Response) => {
  res.sendFile(path.join(templatesDir, "hotels.html"));
});

adminRouter.get("/events", requiresAuth, (_, res: Response) => {
  res.sendFile(path.join(templatesDir, "events.html"));
});

adminRouter.get("/trending", requiresAuth, (_, res: Response) => {
  res.sendFile(path.join(templatesDir, "trending.html"));
});

adminRouter.get("/about", requiresAuth, (_, res: Response) => {
  res.sendFile(path.join(templatesDir, "about.html"));
});

export default adminRouter;
