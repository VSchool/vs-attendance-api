import ex from "express";
import { generateQRCode } from "../services/qr-code.service";
import { sign } from "jsonwebtoken";
import { expressjwt } from "express-jwt";

const qrCodeRouter = ex.Router();

qrCodeRouter.get("/generate", async (req, res) => {
  const accessToken = sign(
    { timestamp: "" + new Date().getTime() },
    process.env.SECRET as string,
    { algorithm: "HS256", expiresIn: "5m" },
  );
  const payload = encodeURI(
    `${process.env.ADMIN_CLIENT_BASE_URL}?access_token=${accessToken}`,
  );
  const dataUrl = await generateQRCode(payload);
  res.status(200).send({ dataUrl });
});

qrCodeRouter.post(
  "/validate",
  expressjwt({ secret: process.env.SECRET as string, algorithms: ["ES256"] }),
  (req, res) => {
    res.status(200).send({ success: true });
  },
);

// generate qr code with access token (5 min expiry time) encoded in url parameters
// landing page on website where key is decoded, validates against api, then adds entry to spreadsheet

export { qrCodeRouter };
