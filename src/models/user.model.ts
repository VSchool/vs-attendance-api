import mg from "mongoose";

const UserSchema = new mg.Schema({
  admin: Boolean,
  username: { unique: true, type: String },
  password: String,
  first_name: String,
  last_name: String,
  email: String,
});

export const UserModel = mg.model("User", UserSchema);
