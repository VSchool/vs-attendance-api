import { mockServer } from "../__tests__/utils";
import { decodeQRCodeDataUrl } from "../services/qr-code.service";
import * as jwt from "jsonwebtoken";
import * as locationService from "../services/location.service";
import * as utils from "../utils";

jest.mock("express-jwt");
jest.mock("jsonwebtoken");
const signSpy = jest.spyOn(jwt, "sign");

describe("qr-code-router.ts", () => {
  describe("GET /api/qr-code/generate", () => {
    it("Should bypass location check in dev environment and generate a QR code as a base64 encoded png and an access code with configured expiration date", async () => {
      const getLocationCoordinatesSpy = jest.spyOn(
        locationService,
        "getLocationCoordinates",
      );
      const isProductionEnvSpy = jest.spyOn(utils, "isProductionEnv");
      isProductionEnvSpy.mockReturnValue(false);

      const response = await mockServer().get("/api/qr-code/generate");
      expect(response.headers["content-type"]).toContain("application/json");
      expect(getLocationCoordinatesSpy).toHaveBeenCalledTimes(0);
      expect(isProductionEnvSpy).toHaveReturnedWith(false);
      expect(response.body.dataUrl).toContain(
        "data:image/png;base64,iVBORw0KGgo",
      );
      const decoded = await decodeQRCodeDataUrl(response.body.dataUrl);
      expect(decoded).toBe(
        `${process.env.USER_CLIENT_BASE_URL}?access_token=ACCESS_TOKEN`,
      );
      expect(signSpy.mock.calls[0][2].expiresIn).toBe(
        process.env.ACCESS_TOKEN_DURATION,
      );
    });

    it("Should perform location check in prod environment and generate a QR code as a base64 encoded png and an access code with configured expiration date", async () => {
      const getLocationCoordinatesSpy = jest.spyOn(
        locationService,
        "getLocationCoordinates",
      );
      const isProductionEnvSpy = jest.spyOn(utils, "isProductionEnv");
      const validateCoordsSpy = jest.spyOn(utils, "validateCoords");

      isProductionEnvSpy.mockReturnValue(true);
      getLocationCoordinatesSpy.mockResolvedValue({
        latitude: 100,
        longitude: 100,
      });
      validateCoordsSpy.mockReturnValue(true);

      const response = await mockServer().get("/api/qr-code/generate");
      expect(response.headers["content-type"]).toContain("application/json");
      expect(getLocationCoordinatesSpy).toHaveBeenCalledTimes(1);
      expect(response.body.dataUrl).toContain(
        "data:image/png;base64,iVBORw0KGgo",
      );
      const decoded = await decodeQRCodeDataUrl(response.body.dataUrl);
      expect(decoded).toBe(
        `${process.env.USER_CLIENT_BASE_URL}?access_token=ACCESS_TOKEN`,
      );
      expect(signSpy.mock.calls[0][2].expiresIn).toBe(
        process.env.ACCESS_TOKEN_DURATION,
      );
    });

    it("Should throw error if location check fails", async () => {
      const getLocationCoordinatesSpy = jest.spyOn(
        locationService,
        "getLocationCoordinates",
      );
      const isProductionEnvSpy = jest.spyOn(utils, "isProductionEnv");
      const validateCoordsSpy = jest.spyOn(utils, "validateCoords");

      isProductionEnvSpy.mockReturnValue(true);
      getLocationCoordinatesSpy.mockResolvedValue({
        latitude: 100,
        longitude: 100,
      });
      validateCoordsSpy.mockReturnValue(false);

      const response = await mockServer().get("/api/qr-code/generate");
      expect(response.status).toBe(500);
      expect(getLocationCoordinatesSpy).toHaveBeenCalledTimes(1);
      expect(response.body.message).toEqual(
        "InvalidLocation: Invalid location of request",
      );
    });
  });

  describe("GET /api/qr-code/validate", () => {
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

  describe("GET /api/qr-code/config", () => {
    it("should provide config object", async () => {
      const response = await mockServer().get("/api/qr-code/config");
      expect(response.status).toBe(200);
      expect(response.body.config).toEqual({
        interval: 60000,
      });
    });
  });
});
