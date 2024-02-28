import { EntryModel } from "../models/entry.model";
import { EntryFilters, EntryPayload } from "../types";
import fns from "date-fns";

export const checkIn = async (payload: EntryPayload) => {
  const today = new Date();
  const entry = new EntryModel({
    first_name: payload.firstName,
    last_name: payload.lastName,
    start: new Date(),
    email: payload.email,
    week_of: fns.startOfDay(
      fns.isMonday(today) ? today : fns.previousMonday(new Date()),
    ),
  });
  const doc = await entry.save();
  return doc;
};

export const checkOut = async (payload: EntryPayload) => {
  const entries = await EntryModel.find({ email: payload.email }).sort({
    createdAt: "desc",
  });
  const latest = entries[0];
  if (!latest) throw Error("InvalidCheckout: No entries found");
  if (latest.end)
    throw Error(
      "InvalidCheckout: Latest entry already has checked out at " + latest.end,
    );
  latest.end = new Date();
  return await latest.save();
};

export const getAllEntries = async (filters: EntryFilters) => {
  const entries = await EntryModel.find(filters);
  return entries;
};
