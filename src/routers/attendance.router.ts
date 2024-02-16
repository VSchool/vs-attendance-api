import ex from "express";
import { checkIn } from "../services/attendance.service";
import { expressjwt } from "express-jwt";
import { SubmissionType, User } from "../types";

const attendanceRouter = ex.Router();

attendanceRouter.use(expressjwt({ secret: process.env.SECRET as string, algorithms: ["HS256"] }))

attendanceRouter.post('/log-entry', async (req, res, next) => {
    const { fields, type } = req.body as { fields: User, type: SubmissionType };
    // add entry or update existing entry based on type
    // if check in, create new record with uid, fields, entry, 
    try {
        if (type === SubmissionType.CheckIn) {
            await checkIn(fields);
        } else {
            // check out
        }
    } catch (err) {
        console.error(err);
        return next('There was a problem processing the request')
    }
    res.status(200).send({ success: true })
})

export { attendanceRouter };
