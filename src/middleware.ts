import * as exjwt from "express-jwt";

export const validateAccessToken = () =>
  exjwt.expressjwt({
    secret: process.env.SECRET as string,
    algorithms: ["HS256"],
  });

export const validateAdminAccessToken = () =>
  exjwt.expressjwt({
    secret: process.env.ADMIN_SECRET as string,
    algorithms: ["HS256"],
  });
