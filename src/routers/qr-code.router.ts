import ex from "express";
import {
  generateQRCode,
  getAdminClientConfig,
} from "../services/qr-code.service";
import { generateAccessToken } from "../services/auth.service";
import { validateAccessToken } from "../middleware";
import { getLocationCoordinates } from "../services/location.service";
import { isProductionEnv, parseIp, validateCoords } from "../utils";

const qrCodeRouter = ex.Router();

qrCodeRouter.get("/generate", async (req, res) => {
  const accessToken = generateAccessToken();
  const payload = encodeURI(
    `${process.env.USER_CLIENT_BASE_URL}?access_token=${accessToken}`,
  );
  const dataUrl = await generateQRCode(payload);
  res.status(200).send({ dataUrl });
});

qrCodeRouter.get("/validate", validateAccessToken(), (req, res) => {
  res.status(200).send({ success: true });
});

qrCodeRouter.get("/config", async (req, res, next) => {
  try {
    const ip = parseIp(req);
    const config = getAdminClientConfig();
    if (isProductionEnv()) {
      const coords = await getLocationCoordinates(ip as string);
      if (!validateCoords(coords))
        throw Error("InvalidLocation: Invalid location of request");
    }
    res.status(200).send({ config });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export { qrCodeRouter };
