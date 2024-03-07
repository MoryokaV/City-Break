import { Schema, model } from "mongoose";

export interface IUser {
  fullname: string;
  username: string;
  password: string;
  admin: boolean;
  city_id: string;
}

const UserSchema = new Schema<IUser>({
  fullname: String,
  username: String,
  password: String,
  admin: Boolean,
  city_id: String,
});

export const User = model<IUser>("User", UserSchema, "login");
