import { Response, Router } from "express";
import path from "path";
import { requiresMasterAuth } from "../middleware/auth";
import * as LoginController from "../controllers/loginController";

const router: Router = Router();

const templatesDir = path.join(__dirname, "..", "..", "templates");

router.get("/master", requiresMasterAuth, (_, res: Response) => {
  return res.sendFile(path.join(templatesDir, "master.html"));
});

router.get("/login", (_, res: Response) => {
  return res.sendFile(path.join(templatesDir, "login.html"));
});
router.post("/login", LoginController.login);

router.get("/logout", LoginController.logout);

router.get("/currentUser", LoginController.getCurrentUser);

export default router;
