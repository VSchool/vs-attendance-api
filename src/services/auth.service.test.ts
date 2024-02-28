import { UserModel } from "../models/user.model";
import {
  generateAccessToken,
  generateAdminAccessToken,
  validateAdminPassword,
} from "./auth.service";
import crypto from "crypto";
import * as jwt from "jsonwebtoken";

describe("auth.service.ts", () => {
  describe("validateAdminPassword()", () => {
    it("should throw if no user found", async () => {
      jest
        .spyOn(UserModel, "findOne")
        .mockImplementationOnce(jest.fn().mockResolvedValue(undefined));
      try {
        const { success } = await validateAdminPassword({
          username: "no-user",
          password: "no-user",
        });
        expect(success).toBe(false);
      } catch (err) {
        expect((err as Error).message).toBe("Unauthorized: No user found");
      }
    });

    it("should throw if passwords don't match", async () => {
      jest
        .spyOn(UserModel, "findOne")
        .mockImplementationOnce(
          jest.fn().mockResolvedValue({ username: "user", password: "hash" }),
        );
      const mockUpdate = jest.fn(() => ({
        digest: jest.fn().mockReturnValue("invalid"),
      }));
      jest
        .spyOn(crypto, "createHash")
        .mockImplementationOnce(
          jest.fn(() => ({ update: mockUpdate }) as unknown as crypto.Hash),
        );
      try {
        const { success } = await validateAdminPassword({
          username: "user",
          password: "invalid-password",
        });
        expect(success).toBe(false);
      } catch (err) {
        expect((err as Error).message).toBe("Unauthorized: Invalid password");
        expect(mockUpdate).toHaveBeenCalledWith("invalid-password", "utf8");
      }
    });

    it("should log in successfully with correct username/password", async () => {
      jest
        .spyOn(UserModel, "findOne")
        .mockImplementationOnce(
          jest.fn().mockResolvedValue({ username: "user", password: "hash" }),
        );
      const mockUpdate = jest.fn(() => ({
        digest: jest.fn().mockReturnValue("hash"),
      }));
      jest
        .spyOn(crypto, "createHash")
        .mockImplementationOnce(
          jest.fn(() => ({ update: mockUpdate }) as unknown as crypto.Hash),
        );
      const { success } = await validateAdminPassword({
        username: "user",
        password: "valid-password",
      });
      expect(success).toBe(true);
    });
  });

  describe("generateAdminAccessToken()", () => {
    it("should generate token from ADMIN_SECRET env variable", () => {
      const signSpy = jest
        .spyOn(jwt, "sign")
        .mockImplementationOnce(() => "admin_access_token");
      const token = generateAdminAccessToken();
      expect(token).toBe("admin_access_token");
      expect(signSpy.mock.calls[0][1]).toBe(process.env.ADMIN_SECRET);
    });
  });

  describe("generateAccessToken()", () => {
    it("should generate token from SECRET env variable", () => {
      const signSpy = jest
        .spyOn(jwt, "sign")
        .mockImplementationOnce(() => "access_token");
      const token = generateAccessToken();
      expect(token).toBe("access_token");
      expect(signSpy.mock.calls[0][1]).toBe(process.env.SECRET);
    });
  });
});
