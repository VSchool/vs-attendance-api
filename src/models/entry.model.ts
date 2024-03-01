import mg from "mongoose";
import { getPreviousMonday } from "../utils";
const EntrySchema = new mg.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: Date,
    week_of: Date, // starts on mondays
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    virtuals: {
      full_name: {
        get() {
          return this.first_name + " " + this.last_name;
        },
      },
    },
  },
);

EntrySchema.pre(["save", "findOneAndUpdate"], function (next) {
  const start = this.get("start") as string;
  if (!start) return next();
  this.set("week_of", getPreviousMonday(start));
  next();
});

export const EntryModel = mg.model("Entry", EntrySchema);
