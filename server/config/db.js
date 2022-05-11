import mongoose from "mongoose";
const db = process.env.MONGO_URI;

mongoose
  .connect(db)
  .then(() => {
    console.log("database is connected!");
  })
  .catch(() => {
    console.log("database is not connected!");
  });
