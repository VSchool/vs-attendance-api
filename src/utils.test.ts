import { parseEntryFilterQueryParams } from "./utils";

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
});
