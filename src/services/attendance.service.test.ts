import { EntryModel } from "../models/entry.model";
import { checkIn, checkOut, getAllEntries } from "./attendance.service";
import fns from "date-fns";

jest.mock("../models/entry.model");
jest.useFakeTimers().setSystemTime(new Date(2024, 1, 1));

describe("attendance.service.test.ts", () => {
  describe("checkIn()", () => {
    it("should create an entry with start and week_of", async () => {
      await checkIn({
        firstName: "new",
        lastName: "user",
        email: "new@user.com",
      });
      expect(EntryModel).toHaveBeenCalledWith({
        first_name: "new",
        last_name: "user",
        email: "new@user.com",
        start: new Date(),
        week_of: fns.previousMonday(Date()),
      });
      expect(EntryModel.prototype.save).toHaveBeenCalledWith();
    });
  });

  describe("checkOut()", () => {
    it("should throw InvalidCheckout error if no entries exist for that user ", async () => {
      jest
        .spyOn(EntryModel, "find")
        .mockImplementationOnce(
          jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([]) }),
        );
      try {
        await checkOut({
          firstName: "new",
          lastName: "user",
          email: "existing@user.com",
        });
      } catch (err) {
        const { message, name } = err as Error;
        expect(name).toBe("Error");
        expect(message).toBe("InvalidCheckout: No entries found");
      }
    });
    it("should throw InvalidCheckout error if last entry has an end date", async () => {
      jest.spyOn(EntryModel, "find").mockImplementationOnce(
        jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue([{ end: new Date() }]),
        }),
      );
      try {
        await checkOut({
          firstName: "already",
          lastName: "checkedout",
          email: "already@checkedout.com",
        });
      } catch (err) {
        const { message, name } = err as Error;
        expect(name).toBe("Error");
        expect(message).toContain(
          "InvalidCheckout: Latest entry already has checked out at",
        );
      }
    });

    it("should update latest entry with end date", async () => {
      const saveSpy = jest.fn().mockResolvedValue({});
      const entry = { save: saveSpy, end: undefined };
      jest.spyOn(EntryModel, "find").mockImplementationOnce(
        jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue([entry]),
        }),
      );
      await checkOut({
        firstName: "ready",
        lastName: "tocheckout",
        email: "ready@tocheckout.com",
      });
      expect(entry.end).toEqual(new Date());
      expect(saveSpy).toHaveBeenCalledWith();
    });
  });

  describe("getAllEntries()", () => {
    it("should retrieve all entries with filters applied", async () => {
      jest
        .spyOn(EntryModel, "find")
        .mockImplementationOnce(jest.fn().mockResolvedValue([]));
      await getAllEntries({});
      expect(EntryModel.find).toHaveBeenCalledWith({});
      await getAllEntries({ email: "test@test.com" });
      expect(EntryModel.find).toHaveBeenCalledWith({
        email: "test@test.com",
      });
    });
  });
});
