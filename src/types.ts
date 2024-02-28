export interface EntryPayload {
  firstName: string;
  lastName: string;
  email: string;
}

export interface TimeEntry {
  first_name: string;
  last_name: string;
  email: string;
  start: string;
  end?: string;
  createdAt: string;
  week_of: string;
}

export enum SubmissionType {
  CheckIn = "CHECK_IN",
  CheckOut = "CHECK_OUT",
}

export interface EntryFilters {
  email?: string;
}

export interface AdminLoginPayload {
  username: string;
  password: string;
}
