import { google } from "googleapis";
import { client } from "./google-auth.service";


const sheetsAPI = google.sheets({ version: "v4", auth: client });

export const getLastEntry = async () => {
  // proof of concept:
  const range = await sheetsAPI.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: "Input!A2:F10000",
  });
  return range.data.values;
};
