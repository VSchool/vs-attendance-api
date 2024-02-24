import mg from "mongoose";

const EntrySchema = new mg.Schema(
  {
    first_name: String,
    last_name: String,
    email: String,
    start: Date,
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

export const EntryModel = mg.model("Entry", EntrySchema);
