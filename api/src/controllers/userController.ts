import { Response, Request, RequestHandler, NextFunction } from "express";
import { createHash } from "crypto";
import { usersCollection } from "../db";

interface LoginRequestBody {
  username: string;
  password: string;
}

export const login: RequestHandler = async (req: Request, res: Response) => {
  let { username, password } = <LoginRequestBody>req.body;

  password = createHash("sha256").update(password).digest("hex");

  const user = await usersCollection.findOne({
    username: username,
    password: password,
  });

  if (user !== null) {
    req.session.logged_in = true;
    req.session.username = user.username;
    req.session.fullname = user.fullname;
    req.session.admin = user.admin;

    if (username === "master") {
      return res.status(200).send({ url: "/master" });
    }

    req.session.city_id = user.city_id;
    //TODO
    req.session.city_name = "Braila";

    res.cookie("cityId", user.city_id);
    return res.status(200).send({ url: "/admin" });
  } else {
    return res.status(401).send("Wrong user or password!");
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
      return res.status(200).redirect("/login");
    }
  });
};

export const getCurrentUser: RequestHandler = (req: Request, res: Response) => {
  const user = { fullname: req.session.fullname, is_admin: req.session.admin };

  res.send(user);
};
