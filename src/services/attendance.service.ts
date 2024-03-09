import { EntryModel } from "../models/entry.model";
import { EntryFilters, EntryPayload, TimeEntry } from "../types";

export const checkIn = async (payload: EntryPayload) => {
  const entry = new EntryModel({
    first_name: payload.firstName,
    last_name: payload.lastName,
    start: new Date(),
    email: payload.email,
  });
  const doc = await entry.save();
  return doc;
};

export const checkOut = async (payload: EntryPayload) => {
  const entries = await EntryModel.find({ email: payload.email }).sort({
    createdAt: "desc",
  });
  const latest = entries[0];
  if (!latest) throw Error("No entries found");
  if (latest.end)
    throw Error("Latest entry already has checked out at " + latest.end);
  latest.end = new Date();
  return await latest.save();
};

export const getAllEntries = async (filters: EntryFilters) => {
  const entries = await EntryModel.find(filters);
  return entries;
};

export const updateEntry = async (id: string, fields: Partial<TimeEntry>) => {
  const entry = await EntryModel.findOneAndUpdate({ _id: id }, fields, {
    new: true,
  });
  if (!entry) throw Error("No entry found with id: " + id);
  return entry;
};

export const deleteEntry = async (id: string) => {
  const entry = await EntryModel.findByIdAndDelete(id);
  if (!entry) throw Error("No entry found with id: " + id);
  return true;
};

export const createEntry = async (fields: TimeEntry) => {
  const entry = new EntryModel(fields);
  const doc = await entry.save();
  return doc;
};
