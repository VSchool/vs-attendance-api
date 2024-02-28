import { expressjwt } from "express-jwt";

export const validateAccessToken = () =>
  expressjwt({ secret: process.env.SECRET as string, algorithms: ["HS256"] });

// validate admin access token
