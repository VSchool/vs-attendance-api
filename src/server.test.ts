import { mockServer } from "./__tests__/utils";

describe("server.ts", () => {
  it("should run", async () => {
    const response = await mockServer().get("/ping");
    expect(response.body.message).toBe("pong");
  });

  it("should serve documentation site", async () => {
    const response = await mockServer().get("/");
    expect(response.headers["content-type"]).toContain("text/html");
    expect(response.text).toContain(
      "<title>V School Attendance API Documentation</title>",
    );
  });
});
