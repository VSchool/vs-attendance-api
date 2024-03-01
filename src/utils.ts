import { Request } from "express";
import { EntryFilters } from "./types";
import fns from "date-fns";
import { createHash } from "crypto";

export const parseEntryFilterQueryParams = (
  params: Request["query"],
): EntryFilters => {
  return Object.keys(params).reduce<EntryFilters>((output, k) => {
    const key = k as keyof EntryFilters;
    const value = params[key] as string;
    const validKeys: (keyof EntryFilters)[] = ["email"];
    if (value && validKeys.includes(key)) {
      switch (key) {
        default:
          return {
            ...output,
            [key]: value as string,
          };
      }
    }
    return output;
  }, {} as EntryFilters);
};

export const getPreviousMonday = (date: Date | string) => {
  return fns.startOfDay(fns.isMonday(date) ? date : fns.previousMonday(date));
};

export const hashString = (str: string) =>
  createHash("sha256").update(str, "utf8").digest("hex");
