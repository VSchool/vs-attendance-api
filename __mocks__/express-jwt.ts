import { NextFunction, Request, Response } from "express";

export const expressjwt = jest.fn(
  () => (req: Request, res: Response, next: NextFunction) => {
    if (req.headers["authorization"] === "Bearer ACCESS_TOKEN") next();
    else {
      res.status(401);
      const err = new Error("No Authorization token found");
      err.name = "UnauthorizedError";
      next(err);
    }
  },
);
