import { EntryModel } from "../models/entry.model";
import { User } from "../types";

export const checkIn = async (user: User) => {
  const entry = new EntryModel({
    first_name: user.firstName,
    last_name: user.lastName,
    start: new Date(),
    email: user.email,
  });
  await entry.save();
};

export const checkOut = async (user: User) => {
  const entries = await EntryModel.find({ email: user.email }).sort({
    createdAt: "desc",
  });
  const latest = entries[0];
  if (!latest) throw Error("No entries found. Cannot check out");
  if (latest.end)
    throw Error("Latest entry already has checked out: " + latest.end);
  await latest.updateOne({ end: new Date() });
};

export const getAllEntries = async () => {
  const entries = await EntryModel.find();
  return entries;
};
