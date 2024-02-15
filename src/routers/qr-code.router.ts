import ex from "express";
import { generateQRCode } from "../services/qr-code.service";
import { expressjwt } from "express-jwt";
import { generateAccessToken } from "../services/auth.service";

const qrCodeRouter = ex.Router();

qrCodeRouter.get("/generate", async (req, res) => {
  const accessToken = generateAccessToken();
  const payload = encodeURI(
    `${process.env.ADMIN_CLIENT_BASE_URL}?access_token=${accessToken}`,
  );
  const dataUrl = await generateQRCode(payload);
  res.status(200).send({ dataUrl });
});

qrCodeRouter.get(
  "/validate",
  expressjwt({ secret: process.env.SECRET as string, algorithms: ["HS256"] }),
  (req, res) => {
    res.status(200).send({ success: true });
  },
);

export { qrCodeRouter };
