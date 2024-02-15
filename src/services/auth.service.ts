import { sign } from "jsonwebtoken";

export const generateAccessToken = () => {
  const accessToken = sign(
    { timestamp: "" + new Date().getTime() },
    process.env.SECRET as string,
    { algorithm: "HS256", expiresIn: process.env.ACCESS_TOKEN_DURATION },
  );

  return accessToken;
};
