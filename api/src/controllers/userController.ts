import { User } from "../models/userModel";
import { Response, Request, RequestHandler, NextFunction } from "express";
import { createHash } from "crypto";

interface LoginRequestBody {
  username: string;
  password: string;
}

export const login: RequestHandler = async (req: Request, res: Response) => {
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

    if (username === "master") {
      res.status(200).send({ url: "/master" });
      return;
    }

    req.session.city_id = user.city_id;
    //TODO
    req.session.city_name = "Braila";

    res.cookie("cityId", user.city_id);
    res.status(200).send({ url: "/admin" });
  } else {
    res.status(401).send("Wrong user or password!");
  }
};

export const logout: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.status(200).redirect("/login");
    }
  });
};

export const getCurrentUser: RequestHandler = (req: Request, res: Response) => {
  const user = { fullname: req.session.fullname, is_admin: req.session.admin };

  res.send(user);
};
