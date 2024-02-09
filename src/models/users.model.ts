import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, select: false },
  password: { type: String, required: true, select: false },
});

const Users = models.Users || model("Users", userSchema);

export default Users;
