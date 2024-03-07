import { Response, Request, Router } from "express";
import { User } from "../models/userModel";
import { createHash } from "crypto";
import path from "path";

const router = Router();

interface LoginRequestBody {
  username: string;
  password: string;
}

router.get("/master", (_, res: Response) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "public", "templates", "master.html"),
  );
});

router.get("/login", (_, res: Response) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "public", "templates", "login.html"),
  );
});

router.post("/login", async (req: Request, res: Response) => {
  let { username, password } = <LoginRequestBody>req.body;

  password = createHash("sha256").update(password).digest("hex");

  const user = await User.findOne({
    username: username,
    password: password,
  });

  if (user !== null) {
    req.session.logged_in = true;
    req.session.username = user.username;
    req.session.fullname = user.fullname;
    req.session.admin = user.admin;

    if (username == "master") {
      res.status(200).send({ url: "/master" });
    }

    req.session.city_id = user.city_id;
    //TODO
    req.session.city_name = "Braila";

    res.cookie("cityId", user.city_id);
    res.status(200).send({ url: "/admin" });
  } else {
    console.log(user);
    res.status(401).send("Wrong user or password!");
  }
});

export default router;
