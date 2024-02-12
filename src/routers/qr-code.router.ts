import ex from "express";
import { generateQRCode } from "../services/qr-code.service";

const qrCodeRouter = ex.Router();

qrCodeRouter.post("/generate", async (req, res) => {
  const dataUrl = await generateQRCode(req.body.userData);
  res.status(200).send({ dataUrl });
});

export { qrCodeRouter };
