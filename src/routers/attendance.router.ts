import ex from "express";
import {
  checkIn,
  checkOut,
  getAllEntries,
} from "../services/attendance.service";
import { SubmissionType, EntryPayload } from "../types";
import { parseEntryFilterQueryParams } from "../utils";
import { validateAccessToken } from "../middleware";

const attendanceRouter = ex.Router();

attendanceRouter.get("/entries", async (req, res) => {
  const entries = await getAllEntries(parseEntryFilterQueryParams(req.query));
  res.status(200).send({ entries, success: true });
});

// PUT entries/:id
// DELETE entries:id
// POST entries

attendanceRouter.post(
  "/log-entry",
  validateAccessToken(),
  async (req, res, next) => {
    const { fields, type } = req.body as {
      fields: EntryPayload;
      type: SubmissionType;
    };
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
  },
);

export { attendanceRouter };
