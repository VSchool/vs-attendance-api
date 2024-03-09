import { sign } from "jsonwebtoken";
import { AdminLoginPayload } from "../types";
import { createHash } from "crypto";
import { UserModel } from "../models/user.model";

export const generateAccessToken = () => {
  const accessToken = sign(
    { timestamp: "" + new Date().getTime() },
    process.env.SECRET as string,
    { algorithm: "HS256", expiresIn: process.env.ACCESS_TOKEN_DURATION },
  );

  return accessToken;
};

export const generateAdminAccessToken = () => {
  const accessToken = sign(
    { timestamp: "" + new Date().getTime() },
    process.env.ADMIN_SECRET as string,
    { algorithm: "HS256", expiresIn: "1hr" },
  );
  return accessToken;
};

export const validateAdminPassword = async (payload: AdminLoginPayload) => {
  const adminUser = await UserModel.findOne({ username: payload.username });
  if (!adminUser) throw Error("No user found");
  const hash = createHash("sha256")
    .update(payload.password, "utf8")
    .digest("hex");
  if (hash !== adminUser.password) throw Error("Invalid password");
  return { success: true };
};
