import ex from "express";
import {
  checkIn,
  checkOut,
  getAllEntries,
} from "../services/attendance.service";
import { expressjwt } from "express-jwt";
import { SubmissionType, User } from "../types";
import { parseEntryFilterQueryParams } from "../utils";

const attendanceRouter = ex.Router();

attendanceRouter.get("/entries", async (req, res) => {
  const entries = await getAllEntries(parseEntryFilterQueryParams(req.query));
  res.status(200).send({ entries, success: true });
});

attendanceRouter.use(
  expressjwt({ secret: process.env.SECRET as string, algorithms: ["HS256"] }),
);

attendanceRouter.post("/log-entry", async (req, res, next) => {
  const { fields, type } = req.body as { fields: User; type: SubmissionType };
  try {
    switch (type) {
      case SubmissionType.CheckIn: {
        const entry = await checkIn(fields);
        res.status(200).send({ success: true, entry });
        break;
      }
      case SubmissionType.CheckOut: {
        const entry = await checkOut(fields);
        res.status(200).send({ success: true, entry });
        break;
      }
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

export { attendanceRouter };
