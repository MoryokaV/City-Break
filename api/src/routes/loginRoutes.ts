import { Response, Router } from "express";
import path from "path";
import { requiresMasterAuth } from "../middleware/auth";
import * as UserController from "../controllers/userController";

const router: Router = Router();

const templatesDir = path.join(__dirname, "..", "..", "templates");

router.get("/master", requiresMasterAuth, (_, res: Response) => {
  res.sendFile(path.join(templatesDir, "master.html"));
});

router.get("/login", (_, res: Response) => {
  res.sendFile(path.join(templatesDir, "login.html"));
});

router.get("/logout", UserController.logout);
router.post("/login", UserController.login);
router.get("/currentUser", UserController.getCurrentUser);

export default router;
