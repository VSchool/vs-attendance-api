// import { google } from "googleapis";
// import { client } from "./google-auth.service";
// import { User } from "../types";
// import { randomUUID } from "crypto";

import { EntryModel } from "../models/entry.model";
import { User } from "../types";

export const checkIn = async (user: User) => {
  const entry = new EntryModel({
    first_name: user.firstName,
    last_name: user.lastName,
    start: new Date(),
    email: user.email,
  });
  await entry.save();
};

export const checkOut = async (user: User) => {
  const entries = await EntryModel.find({ email: user.email }).sort({
    createdAt: "desc",
  });
  const latest = entries[0];
  if (!latest) throw Error("No entries found. Cannot check out");
  if (latest.end)
    throw Error("Latest entry already has checked out: " + latest.end);
  await latest.updateOne({ end: new Date() });
};

// const sheetsAPI = google.sheets({ version: "v4", auth: client });

// export const checkIn = async (user: User) => {
//   // proof of concept:
//   await sheetsAPI.spreadsheets.batchUpdate({
//     spreadsheetId: process.env.SPREADSHEET_ID,
//     requestBody: {
//       requests: [
//         {
//           insertDimension: {
//             range: {
//               dimension: 'ROWS',
//               startIndex: 1,
//               endIndex: 2,
//             },
//           }
//         }
//       ]
//     }
//   })

//   const date = new Date();
//   await sheetsAPI.spreadsheets.values.update({
//     spreadsheetId: process.env.SPREADSHEET_ID,
//     range: "Input!A2:H",
//     valueInputOption: "USER_ENTERED",
//     requestBody: {
//       range: "Input!A2:H",
//       majorDimension: "ROWS",
//       // determine entry #
//       values: [[randomUUID(), 1, date.toLocaleDateString(), `${user.firstName} ${user.lastName}`, user.email, `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`, '', '=if(g2,(G2-F2)*24,0)']]
//     }
//   })

// };
