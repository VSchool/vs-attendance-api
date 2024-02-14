import ex from "express";
import { generateQRCode } from "../services/qr-code.service";
import { sign } from "jsonwebtoken";

const qrCodeRouter = ex.Router();

qrCodeRouter.get("/generate", async (req, res) => {
  const accessToken = sign(
    "" + new Date().getTime(),
    process.env.SECRET as string,
    { algorithm: "HS256", expiresIn: 1000 * 60 * 5 },
  );
  const payload = encodeURI(
    `${process.env.CLIENT_BASE_URL}?access_token=${accessToken}`,
  );
  const dataUrl = await generateQRCode(payload);
  res.status(200).send({ dataUrl });
});

// generate qr code with access token (5 min expiry time) encoded in url parameters
// landing page on website where key is decoded, validates against api, then adds entry to spreadsheet

export { qrCodeRouter };
