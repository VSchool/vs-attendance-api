import ex from "express";
import { getLastEntry } from "../services/attendance.service";

const attendanceRouter = ex.Router();

attendanceRouter.get('/test', async (req, res) => {
    const data = await getLastEntry();
    res.status(200).send({data})
})

export { attendanceRouter };
