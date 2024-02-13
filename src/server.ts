import ex, { NextFunction, Request, Response } from "express";
import path from "node:path";
import { qrCodeRouter } from "./routers/qr-code.router";

const server = ex();

server.use(ex.json());
server.use(ex.static(path.resolve(__dirname, "..", "public")));
server.get("/ping", (req, res) => res.status(200).send({ message: "pong" }));

server.get("/docs", (req, res) => {
  res
    .status(200)
    .sendFile(path.resolve(__dirname, "..", "public", "documentation.html"));
});

server.use("/api/qr-code", qrCodeRouter);

server.use((req, res, next) => {
  res.status(404).send({ message: "Not found" });
  next();
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
server.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: Error, req: Request, res: Response, _next: NextFunction): void => {
    res.send({ message: err.message });
  },
);

export { server };
