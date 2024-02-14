import { mockServer } from "../__tests__/utils";
import { decodeQRCodeDataUrl } from "../services/qr-code.service";

jest.mock("jsonwebtoken", () => ({ sign: () => "ACCESS_TOKEN" }));

describe("qr-code-router.ts", () => {
  it("Should generate a QR code as a base64 encoded png", async () => {
    const response = await mockServer().get("/api/qr-code/generate");
    expect(response.headers["content-type"]).toContain("application/json");
    expect(response.body.dataUrl).toContain(
      "data:image/png;base64,iVBORw0KGgo",
    );
    const decoded = await decodeQRCodeDataUrl(response.body.dataUrl);
    expect(decoded).toBe(
      `${process.env.ADMIN_CLIENT_BASE_URL}?access_token=ACCESS_TOKEN`,
    );
  });
});
