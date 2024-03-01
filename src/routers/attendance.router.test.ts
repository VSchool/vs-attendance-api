import * as attendanceService from "../services/attendance.service";
import { mockServer } from "../__tests__/utils";
import { SubmissionType } from "../types";

jest.mock("express-jwt");
jest.mock("jsonwebtoken");
jest.mock("../services/attendance.service");
const checkInSpy = jest.spyOn(attendanceService, "checkIn");
const checkoutSpy = jest.spyOn(attendanceService, "checkOut");
const getAllEntriesSpy = jest.spyOn(attendanceService, "getAllEntries");

describe("attendance.router.ts", () => {
  describe("GET /api/attendance/log-entry", () => {
    it("should fail authorization if access_token is invalid", async () => {
      const response = await mockServer()
        .post("/api/attendance/log-entry")
        .send({ fields: {}, type: SubmissionType.CheckIn });
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("No Authorization token found");
    });

    it("should check in", async () => {
      await mockServer()
        .post("/api/attendance/log-entry")
        .set("Authorization", `Bearer ACCESS_TOKEN`)
        .send({
          fields: { email: "test@test.com" },
          type: SubmissionType.CheckIn,
        });
      expect(checkInSpy).toHaveBeenCalledWith({ email: "test@test.com" });
    });

    it("should check out latest entry for that user", async () => {
      await mockServer()
        .post("/api/attendance/log-entry")
        .set("Authorization", `Bearer ACCESS_TOKEN`)
        .send({
          fields: { email: "test@test.com" },
          type: SubmissionType.CheckOut,
        });
      expect(checkoutSpy).toHaveBeenCalledWith({ email: "test@test.com" });
    });

    it("should fail if last entry end date is filled", async () => {
      checkoutSpy.mockImplementationOnce(() => {
        return Promise.reject(
          Error("InvalidCheckout: Latest entry already has checked out at"),
        );
      });
      const response = await mockServer()
        .post("/api/attendance/log-entry")
        .set("Authorization", `Bearer ACCESS_TOKEN`)
        .send({ fields: {}, type: SubmissionType.CheckOut });
      expect(response.status).toBe(500);
      expect(response.body.message).toContain(
        "InvalidCheckout: Latest entry already has checked out at",
      );
    });

    it("should fail if user has no entries", async () => {
      checkoutSpy.mockImplementationOnce(() => {
        return Promise.reject(Error("InvalidCheckout: No entries found"));
      });
      const response = await mockServer()
        .post("/api/attendance/log-entry")
        .set("Authorization", `Bearer ACCESS_TOKEN`)
        .send({ fields: {}, type: SubmissionType.CheckOut });
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("InvalidCheckout: No entries found");
    });

    it("should get all entries with no filter", async () => {
      getAllEntriesSpy.mockImplementationOnce(
        jest.fn().mockResolvedValue([{}, {}, {}]),
      );
      const response = await mockServer().get("/api/attendance/entries");
      expect(response.status).toBe(200);
      expect(response.body.entries.length).toBe(3);
    });

    it("should get entries with filter query provided", async () => {
      getAllEntriesSpy.mockImplementationOnce(
        jest.fn().mockResolvedValue([{}, {}, {}]),
      );
      const response = await mockServer().get(
        "/api/attendance/entries?&email=test@test.com",
      );
      expect(response.status).toBe(200);
      expect(response.body.entries.length).toBe(3);
      expect(getAllEntriesSpy).toHaveBeenCalledWith({
        email: "test@test.com",
      });
    });

    it("should ignore invalid filter query fields provided", async () => {
      getAllEntriesSpy.mockImplementationOnce(
        jest.fn().mockResolvedValue([{}, {}, {}]),
      );
      const response = await mockServer().get(
        "/api/attendance/entries?invalid=invalid",
      );
      expect(response.status).toBe(200);
      expect(response.body.entries.length).toBe(3);
      expect(getAllEntriesSpy).toHaveBeenCalledWith({});
    });
  });

  describe("PUT /api/attendance/entries/:id", () => {
    it("should fail if admin access token is invalid", async () => {
      const response = await mockServer()
        .put("/api/attendance/entries/0")
        .send({ fields: {} });
      expect(response.statusCode).toBe(401);
    });

    it("should update entry with given id and request body", async () => {
      const response = await mockServer()
        .put("/api/attendance/entries/0")
        .set("Authorization", `Bearer ACCESS_TOKEN`)
        .send({ fields: {} });
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ success: true, entry: {} });
    });
  });

  describe("DELETE /api/attendance/entries/:id", () => {
    it("should fail if admin access token is invalid", async () => {
      const response = await mockServer()
        .put("/api/attendance/entries/0")
        .send({ fields: {} });
      expect(response.statusCode).toBe(401);
    });

    it("should delete entry with given id", async () => {
      const response = await mockServer()
        .delete("/api/attendance/entries/0")
        .set("Authorization", `Bearer ACCESS_TOKEN`)
        .send({ fields: {} });
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ success: true, entryId: "0" });
    });
  });

  describe("POST /api/attendance/entries", () => {
    it("should fail if admin access token is invalid", async () => {
      const response = await mockServer()
        .put("/api/attendance/entries/0")
        .send({ fields: {} });
      expect(response.statusCode).toBe(401);
    });

    it("should create entry with valid request body", async () => {
      const response = await mockServer()
        .post("/api/attendance/entries")
        .set("Authorization", `Bearer ACCESS_TOKEN`)
        .send({ fields: {} });
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ success: true, entry: { _id: "0" } });
    });

    it("should fail with invalid request body", async () => {
      jest
        .spyOn(attendanceService, "createEntry")
        .mockImplementationOnce(
          jest.fn().mockRejectedValue(Error("ValidationError")),
        );
      const response = await mockServer()
        .post("/api/attendance/entries")
        .set("Authorization", `Bearer ACCESS_TOKEN`)
        .send({ fields: {} });
      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: "ValidationError",
      });
    });
  });
});
