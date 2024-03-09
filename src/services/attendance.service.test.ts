import { EntryModel } from "../models/entry.model";
import { TimeEntry } from "../types";
import {
  checkIn,
  checkOut,
  createEntry,
  deleteEntry,
  getAllEntries,
  updateEntry,
} from "./attendance.service";

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
        expect(message).toBe("No entries found");
      }
    });
    it("should throw error if last entry has an end date", async () => {
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
        expect(message).toContain("Latest entry already has checked out at");
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

  describe("updateEntry()", () => {
    it("should update entry with valid _id", async () => {
      jest
        .spyOn(EntryModel, "findOneAndUpdate")
        .mockImplementationOnce(
          jest.fn().mockResolvedValue({ _id: "0", first_name: "test" }),
        );
      const entry = await updateEntry("0", { first_name: "test" });
      expect(EntryModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: "0" },
        { first_name: "test" },
        { new: true },
      );
      expect(entry._id).toBe("0");
    });

    it("should throw error if no entry found", async () => {
      jest
        .spyOn(EntryModel, "findOneAndUpdate")
        .mockImplementationOnce(jest.fn().mockResolvedValue(null));
      try {
        const entry = await updateEntry("0", { first_name: "test" });
        expect(entry).toBe(null);
      } catch (err) {
        expect((err as Error).message).toBe("No entry found with id: 0");
      }
    });
  });

  describe("deleteEntry()", () => {
    it("should delete entry with valid _id", async () => {
      jest
        .spyOn(EntryModel, "findByIdAndDelete")
        .mockImplementationOnce(jest.fn().mockResolvedValue(true));
      const entry = await deleteEntry("0");
      expect(EntryModel.findByIdAndDelete).toHaveBeenCalledWith("0");
      expect(entry).toBe(true);
    });

    it("should throw error if no entry found", async () => {
      jest
        .spyOn(EntryModel, "findByIdAndDelete")
        .mockImplementationOnce(jest.fn().mockResolvedValue(null));
      try {
        const entry = await deleteEntry("0");
        expect(entry).toBe(null);
      } catch (err) {
        expect((err as Error).message).toBe("No entry found with id: 0");
      }
    });
  });

  describe("createEntry()", () => {
    it("should create entry with valid fields", async () => {
      jest.spyOn(EntryModel.prototype, "save");
      const fields = {
        first_name: "test",
        last_name: "test",
        email: "test@test.com",
        start: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      await createEntry(fields);
      expect(EntryModel.prototype.save).toHaveBeenCalledWith();
      expect(EntryModel).toHaveBeenCalledWith(fields);
    });

    it("should fail creation with invalid fields", async () => {
      jest.spyOn(EntryModel.prototype, "save").mockImplementationOnce(() => {
        throw Error("ValidationError");
      });
      const invalidFields = {};
      try {
        const entry = await createEntry(invalidFields as TimeEntry);
        expect(entry).toBeFalsy();
      } catch (err) {
        expect(EntryModel.prototype.save).toHaveBeenCalledWith();
        expect((err as Error).message).toBe("ValidationError");
      }
    });
  });
});
