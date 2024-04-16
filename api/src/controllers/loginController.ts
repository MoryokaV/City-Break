import { Response, Request, RequestHandler, NextFunction } from "express";
import { createHash } from "crypto";
import { citiesCollection, usersCollection } from "../db";

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
      return res.status(200).send({
        user: {
          fullname: req.session.fullname,
          username: req.session.username,
          admin: req.session.admin,
          city_id: "",
          city_name: "",
        },
        url: "/master",
      });
    }

    req.session.city_id = user.city_id;
    req.session.city_name = (await citiesCollection.findOne({
      city_id: user.city_id,
    }))!.name;

    return res.status(200).json({
      user: {
        fullname: req.session.fullname,
        username: req.session.username,
        admin: req.session.admin,
        city_id: req.session.city_id,
        city_name: req.session.city_name,
      },
      url: "/",
    });
  } else {
    return res.status(401).send("Wrong user or password!");
  }
};

export const logout: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.session.destroy(error => {
    if (error) {
      next(error);
    } else {
      return res.status(200).redirect("/login");
    }
  });
};
