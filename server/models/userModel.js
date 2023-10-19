import mongoose from "mongoose";
import validator from "validator";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name Required"],
    },
    email: {
      type: String,
      required: [true, "Email Required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail],
    },
    password: {
      type: String,
      required: [true, "Password Required"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
