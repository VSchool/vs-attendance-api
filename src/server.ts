import ex, { NextFunction, Request, Response } from "express";
import path from "path";
import { qrCodeRouter } from "./routers/qr-code.router";
import cors from "cors";
import { ORIGIN_WHITELIST } from "./constants";
import { attendanceRouter } from "./routers/attendance.router";

const server = ex();

server.use(ex.json())
server.use((req, res, next) => {
  console.log(req.method, req.hostname, req.headers.origin, req.body);
  next()
})
server.use(ex.static(path.resolve(__dirname, "..", "public"))
)
server.use(cors((req, cb) => {
  cb(null, { origin: ORIGIN_WHITELIST.includes(req.headers.origin || "") });
}))
server.use(ex.static(path.resolve(__dirname, "..", "public")));


server.get("/ping", (req, res) => res.status(200).send({ message: "pong" }));

server.get(["/", "/docs"], (req, res) => {
  res
    .status(200)
    .sendFile(path.resolve(__dirname, "..", "public", "documentation.html"));
});

server.use("/api/qr-code", qrCodeRouter);
server.use("/api/attendance", attendanceRouter);

server.use((req, res, next) => {
  res.status(404).send({ message: "Not found" });
  next();
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
server.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: Error, req: Request, res: Response, _next: NextFunction): void => {
    const status = err.name === "UnauthorizedError" ? 401 : 500;
    res.status(status).send({ message: err.message });
  },
);

export { server };
