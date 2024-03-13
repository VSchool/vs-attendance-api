import {
  isLocationCheckEnabled,
  parseEntryFilterQueryParams,
  validateCoords,
} from "./utils";

describe("utils.ts", () => {
  describe("parseEntryFilterQueryParams()", () => {
    it("should convert empty query params object to empty EntryFilters object", () => {
      const output = parseEntryFilterQueryParams({});
      expect(output).toEqual({});
    });
    it("should convert query params object to correct EntryFilters object", () => {
      const output = parseEntryFilterQueryParams({
        email: "test@test.com",
      });
      expect(output).toEqual({ email: "test@test.com" });
    });
    it("should ignore invalid parameters and interpret first entry as false", () => {
      const output = parseEntryFilterQueryParams({
        nope: "nope",
      });
      expect(output).toEqual({});
    });
  });

  describe("validateCoords()", () => {
    it("should return true for coordinates within the maximum range", () => {
      expect(
        validateCoords({ latitude: 40.830462, longitude: -111.93095 }),
      ).toBe(true);
    });
    it("should return false for coordinates outside the maximum range", () => {
      expect(
        validateCoords({ latitude: 41.830462, longitude: -112.93095 }),
      ).toBe(false);
    });
  });

  describe("isLocationCheckEnabled", () => {
    it("Should return true or false based on process.env.ENABLE_LOCATION_CHECK value", () => {
      expect(isLocationCheckEnabled()).toBe(
        JSON.parse(process.env.ENABLE_LOCATION_CHECK as string),
      );
    });
  });
});
