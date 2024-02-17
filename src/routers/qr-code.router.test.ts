import { mockServer } from "../__tests__/utils";
import { decodeQRCodeDataUrl } from "../services/qr-code.service";
import * as jwt from "jsonwebtoken";

const signSpy = jest.spyOn(jwt, "sign");

describe("qr-code-router.ts", () => {
  it("Should generate a QR code as a base64 encoded png and an access code with configured expiration date", async () => {
    const response = await mockServer().get("/api/qr-code/generate");
    expect(response.headers["content-type"]).toContain("application/json");
    expect(response.body.dataUrl).toContain(
      "data:image/png;base64,iVBORw0KGgo",
    );
    const decoded = await decodeQRCodeDataUrl(response.body.dataUrl);
    expect(decoded).toBe(
      `${process.env.ADMIN_CLIENT_BASE_URL}?access_token=ACCESS_TOKEN`,
    );
    expect(signSpy.mock.calls[0][2].expiresIn).toBe(
      process.env.ACCESS_TOKEN_DURATION,
    );
  });

  it("Should validate an access token", async () => {
    const response = await mockServer()
      .get("/api/qr-code/validate")
      .set("Authorization", `Bearer ACCESS_TOKEN`);
    expect(response.body.success).toBe(true);
  });

  it("Should invalidate without access token", async () => {
    const response = await mockServer().get("/api/qr-code/validate");
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("No Authorization token found");
  });
});
