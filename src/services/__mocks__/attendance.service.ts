import { TimeEntry, User } from "../../types";

export const checkIn = jest.fn((user: User) =>
  Promise.resolve({ ...user } as TimeEntry),
);
export const checkOut = jest.fn((user: User) =>
  Promise.resolve({ ...user } as TimeEntry),
);
export const getAllEntries = jest.fn(() => Promise.resolve<TimeEntry[]>([]));
