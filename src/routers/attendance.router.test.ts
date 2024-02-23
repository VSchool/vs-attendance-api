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
  it("Should check in", async () => {
    await mockServer()
      .post("/api/attendance/log-entry")
      .set("Authorization", `Bearer ACCESS_TOKEN`)
      .send({
        fields: { email: "test@test.com" },
        type: SubmissionType.CheckIn,
      });
    expect(checkInSpy).toHaveBeenCalledWith({ email: "test@test.com" });
  });

  it("Should check out latest entry for that user", async () => {
    await mockServer()
      .post("/api/attendance/log-entry")
      .set("Authorization", `Bearer ACCESS_TOKEN`)
      .send({
        fields: { email: "test@test.com" },
        type: SubmissionType.CheckOut,
      });
    expect(checkoutSpy).toHaveBeenCalledWith({ email: "test@test.com" });
  });

  it("Should fail if last entry end date is filled", async () => {
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

  it("Should fail if user has no entries", async () => {
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
      "/api/attendance/entries?first_entry=true&email=test@test.com",
    );
    expect(response.status).toBe(200);
    expect(response.body.entries.length).toBe(3);
    expect(getAllEntriesSpy).toHaveBeenCalledWith({
      first_entry: true,
      email: "test@test.com",
    });
  });
});
