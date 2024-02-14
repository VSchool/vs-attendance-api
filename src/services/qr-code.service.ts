import QRCode from "qrcode";
import Jimp from "jimp";
import jsqr, { QRCode as QRC } from "jsqr";

export const generateQRCode = async <P extends string>(payload: P) => {
  return await QRCode.toDataURL(payload, { width: 250 });
};

export const decodeQRCodeDataUrl = async (
  dataUrl: string,
): Promise<string | void> => {
  try {
    const buffer = Buffer.from(
      dataUrl.replace(/^data:image\/[a-z]+;base64,/, ""),
      "base64",
    );
    const image = await Jimp.read(buffer);
    const decoded = jsqr(
      new Uint8ClampedArray(image.bitmap.data),
      image.bitmap.width,
      image.bitmap.height,
    ) as QRC;

    return decoded.data;
  } catch (err) {
    console.error(Error("Error: QR Decoding failed"));
    console.error(err);
  }
};
