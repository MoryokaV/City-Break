import { Session } from "express-session";

declare module "express-session" {
  export interface Session {
    logged_in: boolean;
    username: string;
    fullname: string;
    admin: boolean;
    city_id: string;
    city_name: string;
  }
}
