import ex from "express";
import { generateQRCode } from "../services/qr-code.service";
import { generateAccessToken } from "../services/auth.service";
import { validateAccessToken } from "../middleware";

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

export { qrCodeRouter };
