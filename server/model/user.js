import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    dp: {
      type: String,
      default:
        "https://images.pexels.com/photos/208147/pexels-photo-208147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("users", userSchema);

export default User;
