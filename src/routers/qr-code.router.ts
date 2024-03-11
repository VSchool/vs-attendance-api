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

qrCodeRouter.get("/generate", async (req, res, next) => {
  try {
    const ip = parseIp(req);

    if (isProductionEnv()) {
      const coords = await getLocationCoordinates(ip as string);
      console.log('Validating location of IP: ' + ip, coords)
      if (!validateCoords(coords)) throw Error("Invalid location of request");
    }
    const accessToken = generateAccessToken();
    const payload = encodeURI(
      `${process.env.USER_CLIENT_BASE_URL}?access_token=${accessToken}`,
    );
    const dataUrl = await generateQRCode(payload);
    res.status(200).send({ dataUrl, success: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

qrCodeRouter.get("/validate", validateAccessToken(), (req, res) => {
  res.status(200).send({ success: true });
});

qrCodeRouter.get("/config", async (req, res, next) => {
  try {
    const config = getAdminClientConfig();
    res.status(200).send({ config });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export { qrCodeRouter };
