import { mockServer } from "../__tests__/utils";
import * as authService from "../services/auth.service";

describe("auth.router.ts", () => {
  it("should send admin access token on successful login", async () => {
    jest
      .spyOn(authService, "validateAdminPassword")
      .mockResolvedValue({ success: true });
    jest
      .spyOn(authService, "generateAdminAccessToken")
      .mockReturnValue("admin_access_token");
    const response = await mockServer()
      .post("/api/auth/admin/login")
      .send({ username: "admin", password: "valid" });
    expect(response.body).toEqual({
      success: true,
      access_token: "admin_access_token",
    });
  });

  it("should send 401 unauthorized if password validation fails", async () => {
    jest
      .spyOn(authService, "validateAdminPassword")
      .mockResolvedValue({ success: false });
    jest
      .spyOn(authService, "generateAdminAccessToken")
      .mockImplementationOnce(() => {
        throw Error("Unauthorized");
      });
    const response = await mockServer()
      .post("/api/auth/admin/login")
      .send({ username: "admin", password: "invalid" });
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });
});
