import { Request } from "express";
import { EntryFilters } from "./types";

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