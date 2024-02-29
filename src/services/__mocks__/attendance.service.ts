import { TimeEntry, EntryPayload } from "../../types";

export const checkIn = jest.fn((payload: EntryPayload) =>
  Promise.resolve({
    first_name: payload.firstName,
    last_name: payload.lastName,
    email: payload.email,
  } as TimeEntry),
);
export const checkOut = jest.fn((payload: EntryPayload) =>
  Promise.resolve({
    first_name: payload.firstName,
    last_name: payload.lastName,
    email: payload.email,
  } as TimeEntry),
);
export const getAllEntries = jest.fn(() => Promise.resolve<TimeEntry[]>([]));
export const updateEntry = jest.fn(() => Promise.resolve({} as TimeEntry));
