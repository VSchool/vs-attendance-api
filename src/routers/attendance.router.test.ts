import * as attendanceService from "../services/attendance.service";
import { mockServer } from "../__tests__/utils";
import { SubmissionType } from "../types";
import { EntryModel } from "../models/entry.model";
import {
  __findEmpty,
  __findEndDate,
  __findNoEndDate,
} from "../models/__mocks__/entry.model";

const checkInSpy = jest.spyOn(attendanceService, "checkIn");
const checkoutSpy = jest.spyOn(attendanceService, "checkOut");

describe("attendance.router.ts", () => {
  it("Should check in", async () => {
    await mockServer()
      .post("/api/attendance/log-entry")
      .set("Authorization", `Bearer ACCESS_TOKEN`)
      .send({ fields: {}, type: SubmissionType.CheckIn });
    expect(checkInSpy).toHaveBeenCalledWith({});
  });

  it("Should check out latest entry for that user", async () => {
    jest
      .spyOn(EntryModel, "find")
      .mockImplementationOnce(__findNoEndDate as (typeof EntryModel)["find"]);
    await mockServer()
      .post("/api/attendance/log-entry")
      .set("Authorization", `Bearer ACCESS_TOKEN`)
      .send({ fields: {}, type: SubmissionType.CheckOut });
    expect(checkoutSpy).toHaveBeenCalledWith({});
  });

  it("Should fail if last entry end date is filled", async () => {
    jest
      .spyOn(EntryModel, "find")
      .mockImplementationOnce(__findEndDate as (typeof EntryModel)["find"]);
    const response = await mockServer()
      .post("/api/attendance/log-entry")
      .set("Authorization", `Bearer ACCESS_TOKEN`)
      .send({ fields: {}, type: SubmissionType.CheckOut });
    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      "There was a problem processing the request",
    );
  });

  it("Should fail if user has no entries", async () => {
    jest
      .spyOn(EntryModel, "find")
      .mockImplementationOnce(__findEmpty as (typeof EntryModel)["find"]);
    const response = await mockServer()
      .post("/api/attendance/log-entry")
      .set("Authorization", `Bearer ACCESS_TOKEN`)
      .send({ fields: {}, type: SubmissionType.CheckOut });
    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      "There was a problem processing the request",
    );
  });
});
