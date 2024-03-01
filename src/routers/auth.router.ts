import ex from "express";
import {
  validateAdminPassword,
  generateAdminAccessToken,
} from "../services/auth.service";
import { AdminLoginPayload } from "../types";

const authRouter = ex.Router();

authRouter.post("/admin/login", async (req, res, next) => {
  try {
    await validateAdminPassword(req.body.user as AdminLoginPayload);
    const accessToken = generateAdminAccessToken();
    res.status(200).send({
      success: true,
      access_token: accessToken,
    });
  } catch (err) {
    res.status(401);
    (err as Error).name = "UnauthorizedError";
    next(err);
  }
});

export { authRouter };
