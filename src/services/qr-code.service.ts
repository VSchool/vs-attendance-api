import { QRCodeData } from "../types";
import QRCode from "qrcode";

export const generateQRCode = async (userData: QRCodeData) => {
  const payload = encodeURI(
    `${process.env.ADMIN_CLIENT_BASE_URL}?email=${userData.email}&name=${userData.name}&id=${userData.id}`,
  );
  return await QRCode.toDataURL(payload, { width: 250 });
};
