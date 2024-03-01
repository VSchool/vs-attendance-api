import ex from "express";
import {
  checkIn,
  checkOut,
  createEntry,
  deleteEntry,
  getAllEntries,
  updateEntry,
} from "../services/attendance.service";
import { SubmissionType, EntryPayload, TimeEntry } from "../types";
import { parseEntryFilterQueryParams } from "../utils";
import { validateAccessToken, validateAdminAccessToken } from "../middleware";

const attendanceRouter = ex.Router();

attendanceRouter.get("/entries", async (req, res, next) => {
  try {
    const entries = await getAllEntries(parseEntryFilterQueryParams(req.query));
    res.status(200).send({ entries, success: true });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

attendanceRouter.post(
  "/entries",
  validateAdminAccessToken(),
  async (req, res, next) => {
    try {
      const entry = await createEntry(req.body.fields as TimeEntry);
      res.status(201).send({ success: true, entry });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
);

attendanceRouter.put(
  "/entries/:id",
  validateAdminAccessToken(),
  async (req, res, next) => {
    try {
      const entry = await updateEntry(
        req.params.id,
        req.body.fields as Partial<TimeEntry>,
      );
      res.status(201).send({ success: true, entry });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
);

attendanceRouter.delete(
  "/entries/:id",
  validateAdminAccessToken(),
  async (req, res, next) => {
    try {
      await deleteEntry(req.params.id);
      res.status(201).send({ success: true, entryId: req.params.id });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
);

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
