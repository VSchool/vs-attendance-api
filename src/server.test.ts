import { mockServer } from "./__tests__/utils";

describe("server.ts", () => {
  describe("GET /ping", () => {
    it("should run", async () => {
      const response = await mockServer().get("/ping");
      expect(response.body.message).toBe("pong");
    });
  });

  describe("GET / or /docs", () => {
    it("should serve documentation site", async () => {
      const indexResponse = await mockServer().get("/");
      const docsResponse = await mockServer().get("/docs");
      expect(indexResponse.headers["content-type"]).toContain("text/html");
      expect(indexResponse.text).toContain(
        "<title>V School Attendance API Documentation</title>",
      );
      expect(indexResponse.text).toBe(docsResponse.text);
    });
  });
});
