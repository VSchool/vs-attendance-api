import ex from "express";
import {
  checkIn,
  checkOut,
  getAllEntries,
} from "../services/attendance.service";
import { expressjwt } from "express-jwt";
import { SubmissionType, User } from "../types";

const attendanceRouter = ex.Router();

attendanceRouter.get("/entries", async (req, res) => {
  const entries = await getAllEntries();
  res.status(200).send({ entries });
});

attendanceRouter.use(
  expressjwt({ secret: process.env.SECRET as string, algorithms: ["HS256"] }),
);

attendanceRouter.post("/log-entry", async (req, res, next) => {
  const { fields, type } = req.body as { fields: User; type: SubmissionType };
  try {
    switch (type) {
      case SubmissionType.CheckIn:
        await checkIn(fields);
        break;
      case SubmissionType.CheckOut:
        await checkOut(fields);
    }
    res.status(200).send({ success: true });
  } catch (err) {
    console.error(err);
    return next(Error("There was a problem processing the request"));
  }
});

export { attendanceRouter };
