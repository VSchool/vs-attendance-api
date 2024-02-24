export interface User {
  firstName: string;
  lastName: string;
  email: string;
}

export interface TimeEntry {
  firstName: string;
  lastName: string;
  email: string;
  start: string;
  end?: string;
  full_name: string;
  createdAt: string;
}

export enum SubmissionType {
  CheckIn = "CHECK_IN",
  CheckOut = "CHECK_OUT",
}

export interface EntryFilters {
  email?: string;
}
