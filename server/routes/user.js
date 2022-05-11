import express from "express";
const router = express.Router();
import User from "../model/user.js";
import bcrypt from "bcryptjs";
import { protect } from "../middleware/protect.js";
import tokenGen from "../config/tokenGen.js";

import multer from "multer";

// get file in browser with localhost
router.use("/images", express.static("multer/images"));

//   file uploading with multer
var Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "multer/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: Storage }).single("file");

// signup user
router.post("/user/signup", upload, async (req, res) => {
  const { name, email, password } = req.body;
  // const dp = req.file.filename;
  const dp = req.file
    ? req.file.filename
    : "https://images.pexels.com/photos/208147/pexels-photo-208147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  if (!name || !email || !password) {
    res.status(400).send("please fill all the fields");
  }

  const userExist = await User.findOne({ email: email });
  if (userExist) {
    res.status(400).send("user already exist");
  }
  const hashPass = await bcrypt.hash(password, 12);
  const newUser = User.create({
    name: name,
    email: email,
    password: hashPass,
    dp: dp,
  });

  if (newUser) {
    res.status(200).send(newUser);
  } else {
    res.status(400).send("user signup failed!");
  }
});

// login user
router.post("/user/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send("please fill all the fields");
  }

  const userlog = await User.findOne({ email: email });
  if (userlog) {
    const userPassword = await bcrypt.compare(password, userlog.password);

    const accessToken = tokenGen(userlog._id);

    if (userPassword) {
      res.status(200).send({ userlog, accessToken });
    } else {
      res.status(400).send("invalid credentials");
    }
  } else {
    res.status(400).send("invalid credentials");
  }
});

// search a user / get all users
router.get("/users", protect, async (req, res) => {
  const keyword = req.query.search
    ? {
        // console.log(keyword);
        $or: [
          {
            name: { $regex: req.query.search, $options: "i" },
          },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  // $ne means not equal, it means find all users except that user whose id is matching currently
  const users = await User.find(keyword).find({
    _id: { $ne: req.user._id },
  });
  res.send({ users });
});

export default router;
