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

export const validateCoords = (coords: {
  latitude: number;
  longitude: number;
}) => {
  const getDistance = (from: number, to: number) => Math.abs(from - to);
  return [
    getDistance(coords.latitude, Number(process.env.LOCATION_LATITUDE)),
    getDistance(coords.longitude, Number(process.env.LOCATION_LONGITUDE)),
  ].every((distance) => distance <= Number(process.env.MAXIMUM_RANGE));
};

export const parseIp = (req: Request): string => {
  const forwardedIp = req.headers["x-forwarded-for"];
  const ip = Array.isArray(forwardedIp)
    ? forwardedIp[0]
    : forwardedIp
      ? forwardedIp.split(",").shift()?.trim()
      : req.socket.remoteAddress;
  return ip as string;
};

export const isProductionEnv = () =>
  !["test", "development"].includes(process.env.NODE_ENV as string);

export const isLocationCheckEnabled = () => {
  return process.env.ENABLE_LOCATION_CHECK === "true";
};
