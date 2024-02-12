import { mockServer } from "./__tests__/test-utils";
import Jimp from "jimp";
import jsqr, { QRCode } from "jsqr";
import { config } from "dotenv";
config();

describe("server.ts", () => {
  it("should run", async () => {
    const response = await mockServer().get("/ping");
    expect(response.body.message).toBe("pong");
  });

  it("should serve documentation site", async () => {
    const response = await mockServer().get("/docs");
    expect(response.headers["content-type"]).toContain("text/html");
    expect(response.text).toContain(
      "<title>V School Attendance API Documentation</title>",
    );
  });

  it("Should generate a QR code as a base64 encoded png", async () => {
    const response = await mockServer()
      .post("/api/qr-code/generate")
      .send({
        userData: { email: "test@test.com", name: "test user", id: "123" },
      });
    expect(response.headers["content-type"]).toContain("application/json");
    expect(response.body.dataUrl).toContain(
      "data:image/png;base64,iVBORw0KGgo",
    );
    const buffer = Buffer.from(
      response.body.dataUrl.replace(/^data:image\/[a-z]+;base64,/, ""),
      "base64",
    );
    const image = await Jimp.read(buffer);
    const decoded = jsqr(
      new Uint8ClampedArray(image.bitmap.data),
      image.bitmap.width,
      image.bitmap.height,
    ) as QRCode;
    expect(decoded.data).toBe(
      `${process.env.ADMIN_CLIENT_BASE_URL}?email=test@test.com&name=test%20user&id=123`,
    );
  });

  // add student to google sheets list
  // update sign out time
});
